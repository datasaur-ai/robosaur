import { readdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { assignAllDocuments } from '../assignment/assign-all-documents';
import { getAssignmentConfig } from '../assignment/get-assignment-config';
import { DocumentAssignment } from '../assignment/interfaces';
import { getConfig, setConfigByJSONFile } from '../config/config';
import { StorageSources } from '../config/interfaces';
import { getProjectCreationValidators } from '../config/schema/validator';
import { createProject } from '../datasaur/create-project';
import { getJobs, JobStatus } from '../datasaur/get-jobs';
import { getLocalDocuments } from '../documents/get-local-documents';
import { getObjectStorageDocuments } from '../documents/get-object-storage-documents';
import { LocalDocument, RemoteDocument } from '../documents/interfaces';
import { getLogger } from '../logger';
import { getLabelSetsFromDirectory } from '../utils/labelset';
import { getStorageClient } from '../utils/object-storage';
import { ObjectStorageClient } from '../utils/object-storage/interfaces';
import { sleep } from '../utils/sleep';
import { ScriptState } from '../utils/states/script-state';
import { handleCreateProject } from './create-project.handler';

interface ProjectConfiguration {
  projectName: string;
  documents: Array<RemoteDocument | LocalDocument>;
  documentAssignments: Array<DocumentAssignment>;

  /**
   * @description taken from getConfig().project
   */
  projectConfig: any;
}

const LIMIT_RETRY = 3;
const PROJECT_BEFORE_SAVE = 5;

export async function handleCreateProjects(configFile: string, options) {
  const { dryRun } = options;
  const cwd = process.cwd();
  setConfigByJSONFile(resolve(cwd, configFile), getProjectCreationValidators());

  const documentSource = getConfig().documents.source;
  switch (documentSource) {
    case StorageSources.REMOTE:
      getLogger().warn(
        `${documentSource} is unsupported for multiple projects creation. Falling back to singular project creation...`,
      );
      return handleCreateProject('New Robosaur Project', configFile);
  }
  const { bucketName, prefix: storagePrefix, source, path } = getConfig().documents;
  const { path: stateFilePath } = getConfig().state;

  let scriptState: ScriptState;
  try {
    scriptState = await ScriptState.fromConfig();
  } catch (error) {
    getLogger().info(`no stateFile found in ${stateFilePath}. Robosaur will create a new one`, { error });
    scriptState = await createAndSaveNewState();
  }

  await scriptState.updateInProgressStates();

  let projectsToCreate: { name: string; fullPath: string }[];
  projectsToCreate = await getProjectNamesFromFolderNames(source, { bucketName, prefix: storagePrefix, path });

  // potential improvement: checks documents / file inside each bucket folder
  projectsToCreate = projectsToCreate.filter((project) => !scriptState.projectNameHasBeenUsed(project.name));

  if (projectsToCreate.length === 0) {
    getLogger().info('no projects left to create, exiting...');
    if (!dryRun) await scriptState.save();
    return;
  }
  getLogger().info(`found ${projectsToCreate.length} projects to create: ${JSON.stringify(projectsToCreate)}`);

  const updatedProjectConfig = getConfig().project;
  updatedProjectConfig.labelSets = getLabelSetsFromDirectory(getConfig());

  getLogger().info('validating project assignment...');
  const assignees = await getAssignmentConfig();

  let results: any[] = [];
  let projectCounter = 0;
  for (const projectDetails of projectsToCreate) {
    let counterRetry = 0;
    while (counterRetry < LIMIT_RETRY) {
      getLogger().info(`creating project ${projectDetails.name}...`);

      getLogger().info(`retrieving documents from ${source}...`);
      const documents =
        source === StorageSources.LOCAL
          ? getLocalDocuments(projectDetails.fullPath)
          : await getObjectStorageDocuments(bucketName, projectDetails.fullPath);

      const newProjectConfiguration: ProjectConfiguration = {
        projectName: projectDetails.name,
        documents,
        documentAssignments: assignAllDocuments(assignees, documents),
        projectConfig: updatedProjectConfig,
      };

      if (dryRun) {
        getLogger().info(`new project to be created: ${projectDetails.name} with ${documents.length} documents`, {
          dryRun,
        });
        results.push(newProjectConfiguration);
        counterRetry = LIMIT_RETRY;
      } else {
        getLogger().info(`submitting ProjectLaunchJob...`);
        counterRetry += 1;
        try {
          const result = await doCreateProjectAndUpdateState(newProjectConfiguration, scriptState);
          results.push(result);
          counterRetry = LIMIT_RETRY + 1;
        } catch (error) {
          if (counterRetry >= LIMIT_RETRY) {
            getLogger().error(`reached retry limit for ${projectDetails.name}, skipping...`, { error });
          } else {
            getLogger().warn(`error creating ${projectDetails.name}, retrying...`, { error });
          }
        }
      }
    }

    projectCounter += 1;
    if (projectCounter % PROJECT_BEFORE_SAVE === 0) await scriptState.save();
  }

  if (dryRun) {
    let filepath = resolve(cwd, `dry-run-output-${Date.now()}.json`);
    writeFileSync(filepath, JSON.stringify(results, null, 2));
    getLogger().info(`dry-run results created in ${filepath}`, { dryRun });
  } else {
    await scriptState.save();
    getLogger().info(`sending query for ProjectLaunchJob status...`);
    while (true) {
      await sleep(5000);
      const jobs = await getJobs(results.map((result) => result.job.id));

      const notFinishedStatuses = [JobStatus.IN_PROGRESS, JobStatus.NONE, JobStatus.QUEUED];
      const notFinishedJobs = jobs.filter((job) => notFinishedStatuses.includes(job.status));
      if (notFinishedJobs.length === 0) {
        const failedJobs = jobs.filter((j) => j.status === JobStatus.FAILED).map((j) => j.id);
        const deliveredJobs = jobs.filter((j) => j.status === JobStatus.DELIVERED).map((j) => j.id);
        getLogger().info(`all ProjectLaunchJob finished.`, { failedJobs, deliveredJobs });
        const okCount = deliveredJobs.length;
        const failCount = failedJobs.length;
        const totalCount = okCount + failCount;
        getLogger().info(`completed ${totalCount} jobs; ${okCount} successful and ${failCount} failed`);

        scriptState.updateStatesFromProjectCreationJobs(jobs);
        await scriptState.save();

        getLogger().info('exiting script...');
        break;
      }
      getLogger().info(`found ${notFinishedJobs.length} unfinished job, re-sending query...`);
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
      name: doc.fileName,
    })),
    create: {
      jobId: result.job.id,
      jobStatus: JobStatus.IN_PROGRESS,
    },
    projectId: undefined,
  });
  return result;
}

async function getProjectNamesFromFolderNames(
  source: StorageSources,
  { bucketName, prefix, path }: { bucketName: string; prefix: string; path: string },
) {
  if (source === StorageSources.LOCAL) {
    getLogger().info(`retrieving folders in local directory ${path} `);
    const dirpath = resolve(process.cwd(), getConfig().documents.path);
    const directories = readdirSync(dirpath, { withFileTypes: true }).filter((p) => p.isDirectory());
    return directories.map((dir) => ({ name: dir.name, fullPath: resolve(dirpath, dir.name) }));
  } else {
    getLogger().info(`retrieving folders in bucket ${bucketName} with prefix: '${prefix}'`);
    const storageClient: ObjectStorageClient = getStorageClient(source);
    const foldersInBucket = await storageClient.listSubfoldersOfPrefix(bucketName, prefix);
    getLogger().info(`found folders: ${JSON.stringify(foldersInBucket)}`);

    return foldersInBucket.map((foldername) => ({
      name: foldername.replace(getConfig().documents.prefix, '').replace(/\//g, ''),
      fullPath: foldername,
    }));
  }
}

async function createAndSaveNewState() {
  try {
    const state = new ScriptState();
    await state.save();
    return state;
  } catch (error) {
    getLogger().error(`fail in creating & saving new state file`);
    throw error;
  }
}
