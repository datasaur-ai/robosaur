import { writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { assignAllDocuments } from '../assignment/assign-all-documents';
import { getAssignmentConfig } from '../assignment/get-assignment-config';
import { DocumentAssignment } from '../assignment/interfaces';
import { getConfig, setConfigByJSONFile } from '../config/config';
import { StorageSources } from '../config/interfaces';
import { createProject } from '../datasaur/create-project';
import { getJobs, JobStatus } from '../datasaur/get-jobs';
import { getObjectStorageDocuments } from '../documents/get-object-storage-documents';
import { RemoteDocument } from '../documents/interfaces';
import { getLogger } from '../logger';
import { getLabelSetsFromDirectory } from '../utils/labelset';
import { getStorageClient } from '../utils/object-storage';
import { normalizeFolderName } from '../utils/object-storage/helper';
import { ObjectStorageClient } from '../utils/object-storage/interface';
import { sleep } from '../utils/sleep';
import { ScriptState } from '../utils/states/script-state';
import { handleCreateProject } from './create-project.handler';

interface ProjectConfiguration {
  projectName: string;
  documents: Array<RemoteDocument>;
  documentAssignments: Array<DocumentAssignment>;

  /**
   * @description taken from getConfig().project
   */
  projectConfig: any;
}

const LIMIT_RETRY = 3;
const PROJECT_BEFORE_SAVE = 1;

export async function handleCreateProjects(configFile: string, options) {
  const { dryRun } = options;

  const cwd = process.cwd();
  setConfigByJSONFile(resolve(cwd, configFile));

  const documentSource = getConfig().documents.source;
  switch (documentSource) {
    case StorageSources.LOCAL:
    case StorageSources.REMOTE:
      return await handleCreateProject('New Robosaur Project', configFile);
  }

  const { bucketName, prefix: storagePrefix, source, stateFilePath } = getConfig().documents;

  getLogger().info(`Retrieving folders in bucket ${bucketName} with prefix: '${storagePrefix}'`);
  const storageClient: ObjectStorageClient = getStorageClient(source);
  const foldersInBucket = await storageClient.listSubfoldersOfPrefix(bucketName, storagePrefix);
  let projectsToCreate = foldersInBucket.map((foldername) =>
    foldername.replace(getConfig().documents.prefix, '').replace(/\//g, ''),
  );
  getLogger().info(`Found folders: ${JSON.stringify(foldersInBucket)}`);

  let scriptState: ScriptState;

  try {
    scriptState = await ScriptState.fromConfig();
    await scriptState.updateInProgressStates();
  } catch (error) {
    console.error(error);
    getLogger().info(`No stateFile found in ${stateFilePath}. Robosaur will create a new one`);
    scriptState = new ScriptState();
  }

  // potential improvement: checks documents / file inside each bucket folder
  projectsToCreate = projectsToCreate.filter((project) => {
    return !scriptState
      .getTeamProjectsState()
      .getProjects()
      .some((state) => state.projectName === project && state.status === JobStatus.DELIVERED);
  });

  if (projectsToCreate.length === 0) {
    getLogger().info('No projects left to create, exiting...');
    if (!dryRun) await scriptState.save();
    return;
  }

  getLogger().info(`Found ${projectsToCreate.length} projects to create: ${JSON.stringify(projectsToCreate)}`);

  const updatedProjectConfig = getConfig().project;
  updatedProjectConfig.labelSets = getLabelSetsFromDirectory(getConfig());

  getLogger().info('validating project assignments...');
  const assignees = await getAssignmentConfig();
  getLogger().info('projects assignment');

  let results: any[] = [];
  let projectCounter = 0;
  for (const projectName of projectsToCreate) {
    getLogger().info(`creating project ${projectName}...`);

    getLogger().info(`retrieving documents from ${source}...`);
    const fullPrefix =
      foldersInBucket.find((folderName) => folderName.endsWith(normalizeFolderName(projectName))) ?? '';
    const documents = await getObjectStorageDocuments(bucketName, fullPrefix);

    const newProjectConfiguration: ProjectConfiguration = {
      projectName,
      documents,
      documentAssignments: assignAllDocuments(assignees, documents),
      projectConfig: updatedProjectConfig,
    };

    if (dryRun) {
      getLogger().info(`new project to be created: ${projectName} with ${documents.length} documents`, { dryRun });
      results.push(newProjectConfiguration);
    } else {
      getLogger().info(`Submitting ProjectLaunchJob...`);
      // add retry logic
      let counterRetry = 0;
      let fail = true;
      while (fail) {
        try {
          const result = await doCreateProjectAndUpdateState(newProjectConfiguration, scriptState);
          results.push(result);
          fail = false;
        } catch (error) {
          fail = true;
          if (counterRetry > LIMIT_RETRY) {
            getLogger().error(`reached retry limit for ${projectName}, skipping...`);
            fail = false;
          }
          getLogger().warn(`error creating ${projectName}, retrying...`);
          counterRetry += 1;
        }
      }
      projectCounter += 1;
      if (projectCounter % PROJECT_BEFORE_SAVE === 0) await scriptState.save();
    }
  }

  if (!dryRun) await scriptState.save();

  if (dryRun) {
    let filepath = resolve(cwd, `dry-run-output-${Date.now()}.json`);
    writeFileSync(filepath, JSON.stringify(results, null, 2));
    getLogger().info(`dry-run results created in ${filepath}`, { dryRun });
  } else {
    getLogger().info(`Sending query for ProjectLaunchJob status...`);
    while (true) {
      await sleep(5000);
      const jobs = await getJobs(results.map((result) => result.job.id));
      // get state where status === IN_PROGRESS
      const notFinishedStatuses = [JobStatus.IN_PROGRESS, JobStatus.NONE, JobStatus.QUEUED];
      const notFinishedJobs = jobs.filter((job) => notFinishedStatuses.includes(job.status));
      if (notFinishedJobs.length === 0) {
        getLogger().info(`All ProjectLaunchJob finished.`);
        getLogger().info(JSON.stringify(jobs));
        scriptState.updateStatesFromJobs(jobs);
        await scriptState.save();
        getLogger().info('exiting script...');
        break;
      }
    }
  }
}

async function doCreateProjectAndUpdateState(projectConfiguration: ProjectConfiguration, state: ScriptState) {
  const { projectName, documents, documentAssignments, projectConfig } = projectConfiguration;
  const result = await createProject(projectName, documents, documentAssignments, projectConfig);
  getLogger().info(`ProjectLaunchJob for ${projectName} submitted: Job ID: ${result.job.id}`);
  state.addProject({
    projectName: projectName,
    documents: documents.map((doc) => ({
      bucketName: getConfig().documents.bucketName,
      prefix: join(getConfig().documents.prefix, projectName),
      name: doc.fileName,
    })),
    jobId: result.job.id,
    projectId: undefined,
    status: JobStatus.IN_PROGRESS,
  });
  return result;
}
