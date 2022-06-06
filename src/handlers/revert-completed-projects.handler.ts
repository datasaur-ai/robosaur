import { getConfig, setConfigByJSONFile } from '../config/config';
import { RevertConfig, StorageSources } from '../config/interfaces';
import { getRevertProjectStatusValidator } from '../config/schema/revert-schema-validator';
import { getProject } from '../datasaur/get-project';
import { Project, ProjectStatus } from '../datasaur/interfaces';
import { toggleCabinetStatus } from '../datasaur/toggle-cabinet-status';
import { getLogger } from '../logger';
import { getStorageClient } from '../utils/object-storage';
import { readJSONFile } from '../utils/readJSONFile';
import { sleep } from '../utils/sleep';
import { ScriptAction } from './constants';

const SLEEP_INTERVAL = 2500;

export const handleRevertCompletedProjectsToInReview = async (configFile: string) => {
  setConfigByJSONFile(configFile, getRevertProjectStatusValidator(), ScriptAction.REVERT_PROJECT_STATUS);

  const inputProjectIds = await getProjectIds(getConfig().revert);
  const results = [] as Array<{ id: string; status: ProjectStatus | null }>;

  // use regular while for granular index control
  let i = 0;
  while (i < inputProjectIds.length) {
    const projectId = inputProjectIds[i];
    try {
      getLogger().info(`Retrieving details for ${projectId}`);
      const project: Project = await getProject(projectId);

      let result = { id: projectId } as { id: string; status: ProjectStatus | null };
      if (project.status === ProjectStatus.COMPLETE) {
        getLogger().info(`Sending revert status request for ${projectId}`);
        const updateResult = await toggleCabinetStatus(projectId);
        result.status = updateResult.status;
      } else {
        getLogger().warn(`Invalid status for ${projectId}`, { status: project.status, id: project.id });
        result.status = project.status;
      }
      results.push(result);
      i += 1;
    } catch (error) {
      getLogger().error(`Failed processing ${projectId}`, { error });

      if (error.response.status === 429) {
        getLogger().warn('Received error 429, waiting a bit before retrying...');
        await sleep(SLEEP_INTERVAL * 2);
      } else {
        i += 1;
        results.push({ id: projectId, status: null });
      }
    }

    await sleep(SLEEP_INTERVAL);
  }

  if (results.length === 0) {
    getLogger().error('No valid projects were found');
  }

  if (results.some((res) => res.status !== ProjectStatus.IN_PROGRESS)) {
    getLogger().warn('There are some errors during command execution');
  }
  getLogger().info('Execution results: ', { results });
};

async function getProjectIds(revertConfig: RevertConfig) {
  let projectIds: Array<string>;
  switch (revertConfig.source) {
    case StorageSources.LOCAL:
      projectIds = readJSONFile(revertConfig.path);
      break;
    case StorageSources.AMAZONS3:
    case StorageSources.AZURE:
    case StorageSources.GOOGLE:
      let content = await getStorageClient(revertConfig.source).getStringFileContent(
        revertConfig.bucketName,
        revertConfig.path,
      );
      projectIds = JSON.parse(content);
      break;
    case StorageSources.INLINE:
      projectIds = revertConfig.payload;
      break;
    default:
      throw new Error('Unsupported StorageSources');
  }

  getLogger().info(`Found ${projectIds.length} projectIds in ${revertConfig.path ?? 'inline payload'}`);
  return projectIds;
}
