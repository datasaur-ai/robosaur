import { writeFileSync } from 'fs';
import { basename, resolve } from 'path';
import { getLogger } from '../logger';
import { assignAllDocuments } from '../assignment/assign-all-documents';
import { parseAssignment } from '../assignment/parse-assignment';
import { validateAssignments } from '../assignment/validate-assignments';
import { getConfig, setConfigByJSONFile } from '../config/config';
import { StorageSources } from '../config/interfaces';
import { createProject } from '../datasaur/create-project';
import { getJobs, Job, JobStatus } from '../datasaur/get-jobs';
import { getLabelSetsFromDirectory, LabelSet } from '../utils/labelset';
import { getStorageClient } from '../utils/object-storage';
import { getBucketName, getObjectName, normalizeFolderName } from '../utils/object-storage/helper';
import { ObjectStorageClient } from '../utils/object-storage/interface';
import { sleep } from '../utils/sleep';
import { handleCreateProject } from './create-project.handler';

interface ScriptState {
  jobId: string | null | undefined;
  projectName: string;
  documents: Array<{ bucketName: string; prefix: string; name: string }>;
  projectId: string | null | undefined;
  status: JobStatus;
}

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
  let states: ScriptState[] = [];

  if (stateFilePath) {
    try {
      states = JSON.parse(
        await storageClient.getFileContent(getBucketName(stateFilePath), getObjectName(stateFilePath)),
      );
    } catch (error) {
      states = [];
    }
  }

  // potential improvement: checks documents / file inside each bucket folder
  projectsToCreate = projectsToCreate.filter((project) => {
    return !states.some((state) => state.projectName === project && state.status === JobStatus.DELIVERED);
  });

  if (projectsToCreate.length === 0) {
    getLogger().info('No projects left to create, exiting...');
    return;
  }

  getLogger().info(`Found ${projectsToCreate.length} projects to create: ${JSON.stringify(projectsToCreate)}`);

  const assignees = await parseAssignment();

  const { labelSetDirectory } = getConfig().project;
  let labelsets: LabelSet[] = [];
  if (labelSetDirectory) {
    labelsets = getLabelSetsFromDirectory(labelSetDirectory);

    if (labelsets.length === 0) {
      getLogger().info(`No labelsets was provided in ${labelSetDirectory}`);
      getLogger().info(`To create future projects with labelsets, put csv files in ${labelSetDirectory}`);
      getLogger().info(
        'Reference: https://datasaurai.gitbook.io/datasaur/basics/creating-a-project/label-sets#token-based-labeling',
      );
    }
    getLogger().info('Labelset parsing completed');
  }

  getLogger().info('validating project assignments...');
  await validateAssignments(assignees);

  let results: any[] = [];
  for (const projectName of projectsToCreate) {
    const fullPrefix =
      foldersInBucket.find((folderName) => folderName.endsWith(normalizeFolderName(projectName))) ?? '';
    const bucketItems = await storageClient.listItemsInBucket(bucketName, fullPrefix);

    const documents = await Promise.all(
      bucketItems.map(async (item) => ({
        fileName: basename(item.name),
        externalImportableUrl: await storageClient.getObjectUrl(bucketName, item.name),
      })),
    );

    if (dryRun) {
      const newProjectConfiguration = {
        projectName,
        documents,
        documentAssignments: assignAllDocuments(assignees, documents),
        projectConfig: getConfig().project,
      };
      getLogger().info(`new project to be created: ${projectName} with ${documents.length} documents`);
      results.push(newProjectConfiguration);
    } else {
      getLogger().info(`creating project ${projectName}...`);
      const jobId = await createProject(
        projectName,
        documents,
        assignAllDocuments(assignees, documents),
        getConfig().project,
      );
      results.push(jobId);
      getLogger().info('kembalian await create project', jobId);
      states.push({
        projectName: projectName,
        documents: documents.map((doc) => ({ bucketName, prefix: fullPrefix, name: doc.fileName })),
        jobId: jobId.job.id,
        projectId: undefined,
        status: JobStatus.IN_PROGRESS,
      });
    }
  }

  if (dryRun) {
    let filepath = resolve(cwd, `dry-run-output-${Date.now()}.json`);
    writeFileSync(filepath, JSON.stringify(results, null, 2));
    getLogger().info(`dry-run results created in ${filepath}`);
  } else {
    while (true) {
      await sleep(5000);
      const jobs = await getJobs(results.map((result) => result.job.id));
      const notFinishedStatuses = [JobStatus.IN_PROGRESS, JobStatus.NONE, JobStatus.QUEUED];
      const notFinishedJobs = jobs.filter((job) => notFinishedStatuses.includes(job.status));
      if (notFinishedJobs.length === 0) {
        getLogger().info(JSON.stringify(jobs, null, 2));

        // update states
        jobs.forEach((job: Job) => {
          const index = states.findIndex((s) => s.jobId === job.id);
          states[index].projectId = job.resultId;
          states[index].status = job.status;
        });

        // set state back
        await getStorageClient(source).setFileContent(bucketName, stateFilePath, JSON.stringify(states));
        getLogger().info('exiting script...');
        break;
      }
    }
  }
}
