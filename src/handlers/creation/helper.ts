import { readdirSync } from 'fs';
import { resolve } from 'path';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';
import { createProject } from '../../datasaur/create-project';
import { JobStatus } from '../../datasaur/get-jobs';
import { ProjectStatus } from '../../datasaur/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../../utils/object-storage';
import { ObjectStorageClient } from '../../utils/object-storage/interfaces';
import { ScriptState } from '../../utils/states/script-state';
import { ProjectConfiguration } from '../constants';

export async function doCreateProjectAndUpdateState(projectConfiguration: ProjectConfiguration, state: ScriptState) {
  const { projectName, documents, documentAssignments, projectConfig } = projectConfiguration;
  const result = await createProject(projectName, documents, documentAssignments, projectConfig, undefined);
  getLogger().info(`ProjectLaunchJob for ${projectName} submitted: Job ID: ${result.job.id}`);
  state.addProject({
    projectName: projectName,
    documents: documents.map((doc) => ({
      name: doc.fileName,
    })),
    create: {
      jobId: result.job.id,
      jobStatus: JobStatus.IN_PROGRESS,
      errors: result.job.errors,
    },
    projectId: undefined,
    projectStatus: ProjectStatus.CREATED,
  });
  return result;
}

export async function getProjectsToCreateFromFolderNames(
  source: StorageSources,
  config: { bucketName: string; prefix: string; path: string },
  state: ScriptState,
) {
  const projectNames = await getProjectNamesFromFolderNames(source, { ...config });
  return projectNames.filter((project) => !state.projectNameHasBeenUsed(project.name));
}

export async function getProjectNamesFromFolderNames(
  source: StorageSources,
  { bucketName, prefix, path }: { bucketName: string; prefix: string; path: string },
) {
  if (source === StorageSources.LOCAL) {
    getLogger().info(`retrieving folders in local directory ${path} `);
    const dirpath = resolve(process.cwd(), getConfig().project.documents.path);
    const directories = readdirSync(dirpath, { withFileTypes: true }).filter((p) => p.isDirectory());
    return directories.map((dir) => ({ name: dir.name, fullPath: resolve(dirpath, dir.name) }));
  } else {
    getLogger().info(`retrieving folders in bucket ${bucketName} with prefix: '${prefix}'`);
    const storageClient: ObjectStorageClient = getStorageClient(source);
    const foldersInBucket = await storageClient.listSubfoldersOfPrefix(bucketName, prefix);
    getLogger().info(`found folders: ${JSON.stringify(foldersInBucket)}`);

    return foldersInBucket.map((foldername) => ({
      name: foldername.replace(getConfig().project.documents.prefix, '').replace(/\//g, ''),
      fullPath: foldername,
    }));
  }
}
