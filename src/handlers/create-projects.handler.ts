import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { getAssignmentConfig } from '../assignment/get-assignment-config';
import { getDocumentAssignment } from '../assignment/get-document-assignment';
import { DocumentAssignment } from '../assignment/interfaces';
import { getConfig, setConfigByJSONFile } from '../config/config';
import { StorageSources } from '../config/interfaces';
import { getProjectCreationValidators } from '../config/schema/validator';
import { JobStatus } from '../datasaur/get-jobs';
import { getLocalDocuments } from '../documents/get-local-documents';
import { getObjectStorageDocuments } from '../documents/get-object-storage-documents';
import { LocalDocument, RemoteDocument } from '../documents/interfaces';
import { getLogger } from '../logger';
import { getLabelSetsFromDirectory } from '../utils/labelset';
import { pollJobsUntilCompleted } from '../utils/polling.helper';
import { getQuestionSetFromFile } from '../utils/questionset';
import { getState } from '../utils/states/getStates';
import { ScriptAction } from './constants';
import { handleCreateProject } from './create-project.handler';
import { doCreateProjectAndUpdateState, getProjectNamesFromFolderNames } from './creation/helper';

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
  setConfigByJSONFile(resolve(cwd, configFile), getProjectCreationValidators(), ScriptAction.PROJECT_CREATION);

  const documentSource = getConfig().project.documents.source;
  switch (documentSource) {
    case StorageSources.REMOTE:
      getLogger().warn(
        `${documentSource} is unsupported for multiple projects creation. Falling back to singular project creation...`,
      );
      return handleCreateProject('New Robosaur Project', configFile);
  }
  const { bucketName, prefix: storagePrefix, source, path } = getConfig().project.documents;

  const scriptState = await getState();
  await scriptState.updateInProgressProjectCreationStates();

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
  const projectKind = updatedProjectConfig.documentSettings.kind;
  switch (projectKind) {
    case 'TOKEN_BASED':
      updatedProjectConfig.labelSets = getLabelSetsFromDirectory(getConfig());
      break;
    case 'DOCUMENT_BASED':
    case 'ROW_BASED':
      if (updatedProjectConfig.questions) break;
      if (updatedProjectConfig.questionSetFile) {
        updatedProjectConfig.questions = getQuestionSetFromFile(getConfig());
        break;
      }
      getLogger().warn(`no 'questions' or 'questionSetFile' is configured in ${configFile}`);
      if (getConfig().project.labelSetDirectory) {
        getLogger().warn(
          `Robosaur does not support ROW_BASED project creation using TOKEN_BASED csv labelsets. Please refer to our JSON documentation on how to structure ROW_BASED questions`,
          { link: 'https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/create-new-project/questions' },
        );
      }
      break;
    default:
      getLogger().warn(`unrecognized project kind: ${projectKind}...`);
  }

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
        documentAssignments: getDocumentAssignment(assignees, documents),
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
            getLogger().error(`reached retry limit for ${projectDetails.name}, skipping...`, {
              error: JSON.stringify(error),
              message: error.message,
            });
          } else {
            getLogger().warn(`error creating ${projectDetails.name}, retrying...`, {
              error: JSON.stringify(error),
              message: error.message,
            });
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

    const jobs = await pollJobsUntilCompleted(results.map((r) => r.job.id));

    const createFail = jobs.filter((j) => j.status === JobStatus.FAILED);
    const createOK = jobs.filter((j) => j.status === JobStatus.DELIVERED).map((j) => j.id);
    getLogger().info(`all ProjectLaunchJob finished.`, { success: createOK, fail: createFail.map((j) => j.id) });
    getLogger().info(`completed ${jobs.length} jobs; ${createOK.length} successful and ${createFail.length} failed`);
    for (const job of createFail) {
      getLogger().error(`error for ${job.id}`, { ...job });
    }

    scriptState.updateStatesFromProjectCreationJobs(jobs);
    await scriptState.save();
  }
}
