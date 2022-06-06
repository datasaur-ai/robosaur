import { chunk } from 'lodash';
import { getActiveTeamId, getConfig, setConfigByJSONFile } from '../config/config';
import { RevertConfig, StorageSources } from '../config/interfaces';
import { getRevertProjectStatusValidator } from '../config/schema/revert-schema-validator';
import { getPaginatedProjects } from '../datasaur/get-projects';
import { Project, ProjectStatus } from '../datasaur/interfaces';
import { toggleCabinetStatus } from '../datasaur/toggle-cabinet-status';
import { getLogger } from '../logger';
import { getStorageClient } from '../utils/object-storage';
import { readJSONFile } from '../utils/readJSONFile';
import { sleep } from '../utils/sleep';
import { ScriptAction } from './constants';

const SLEEP_INTERVAL = 1500;
const TAKE_PER_PAGE = 2;
const CHUNK_LENGTH = 1;

export const handleRevertCompletedProjectsToInReview = async (configFile: string) => {
  setConfigByJSONFile(configFile, getRevertProjectStatusValidator(), ScriptAction.REVERT_PROJECT_STATUS);

  const inputProjectIds = await getProjectIds(getConfig().revert);
  let skip = 0;

  let remainingProjectIds = [...inputProjectIds];
  let continueLooping = true;
  const validProjects = [] as Project[];
  while (continueLooping) {
    const paginatedResult = await getPaginatedProjects(
      { teamId: getActiveTeamId(), statuses: [ProjectStatus.COMPLETE] },
      skip,
      TAKE_PER_PAGE,
    );

    if (paginatedResult.totalCount === 0) {
      getLogger().info('No projects with COMPLETE status was found');
      break;
    }

    getLogger().info(
      `Checking ${skip + paginatedResult.nodes.length} / ${paginatedResult.totalCount} COMPLETE projects...`,
    );

    const projects = paginatedResult.nodes;
    const newValidProjects = projects.filter(
      (p) => inputProjectIds.includes(p.id) && p.status === ProjectStatus.COMPLETE,
    );

    if (newValidProjects.length > 0) {
      getLogger().info(`valid projects found: ${newValidProjects.map((p) => p.id)}`, {
        count: newValidProjects.length,
        projects: newValidProjects,
      });
      validProjects.push(...newValidProjects);
    }

    continueLooping = Boolean(paginatedResult.pageInfo.nextCursor && remainingProjectIds.length > 0);
    if (continueLooping) {
      skip += TAKE_PER_PAGE;
      sleep(1000);
    }
  }

  const results = [] as Array<{ projectId: string; status: ProjectStatus }>;
  const chunkedProjects = chunk(validProjects, CHUNK_LENGTH);
  for (const batch of chunkedProjects) {
    const bacthResult = await Promise.all(
      batch.map(async (project) => {
        getLogger().info(`sending request to revert project ${project.id} status...`);
        try {
          const updatedStatus = await toggleCabinetStatus(project.id);
          return { projectId: project.id, status: updatedStatus.status };
        } catch (error) {
          getLogger().error(`Error on updating ${project.id}`, { error: error });
          return { projectId: project.id, status: project.status };
        }
      }),
    );

    results.push(...bacthResult);
    await sleep(SLEEP_INTERVAL);
  }

  if (results.length === 0) {
    getLogger().info('No valid projects are found');
    return;
  }

  if (results.some((val) => val.status !== ProjectStatus.IN_PROGRESS)) {
    getLogger().warn('There are some failures during command execution');
  }
  getLogger().info('Execution results: ', { data: results });
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
