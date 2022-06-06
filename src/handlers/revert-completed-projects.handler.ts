import { validateAdditionalItems } from 'ajv/dist/vocabularies/applicator/additionalItems';
import { getActiveTeamId, getConfig, setConfigByJSONFile } from '../config/config';
import { RevertConfig, StorageSources } from '../config/interfaces';
import { getRevertProjectStatusValidator } from '../config/schema/revert-schema-validator';
import { getPaginatedProjects } from '../datasaur/get-projects';
import { ProjectStatus } from '../datasaur/interfaces';
import { toggleCabinetStatus } from '../datasaur/toggle-cabinet-status';
import { getLogger } from '../logger';
import { getStorageClient } from '../utils/object-storage';
import { readJSONFile } from '../utils/readJSONFile';
import { sleep } from '../utils/sleep';
import { ScriptAction } from './constants';

const SLEEP_INTERVAL = 1500;
const TAKE_PER_PAGE = 100;

export const handleRevertCompletedProjectsToInReview = async (configFile: string) => {
  setConfigByJSONFile(configFile, getRevertProjectStatusValidator(), ScriptAction.REVERT_PROJECT_STATUS);

  const inputProjectIds = await getProjectIds(getConfig().revert);
  let skip = 0;

  let remainingProjectIds = [...inputProjectIds];
  const results = [] as Array<{ projectId: string; status: ProjectStatus }>;
  let continueLooping = true;

  while (continueLooping) {
    const paginatedResult = await getPaginatedProjects({ teamId: getActiveTeamId() }, skip, TAKE_PER_PAGE);

    if (paginatedResult.totalCount === 0) {
      getLogger().info('No projects with COMPLETE status was found');
      break;
    }

    getLogger().info(`Checking ${skip + paginatedResult.nodes.length} / ${paginatedResult.totalCount} projects...`);

    const projects = paginatedResult.nodes;
    const validProjects = projects.filter((p) => inputProjectIds.includes(p.id) && p.status === ProjectStatus.COMPLETE);

    getLogger().info(`Project with COMPLETED status: ${validProjects}`, {
      count: validProjects.length,
      projects: validProjects,
    });

    const currentResults = await Promise.all(
      validProjects.map(async (project) => {
        const retval = { projectId: project.id } as { projectId: string; status: ProjectStatus };

        try {
          const updatedStatus = await toggleCabinetStatus(project.id);
          retval.status = updatedStatus.status;
        } catch (error) {
          getLogger().error(`Fail to toggle project status for ${project.id}`, { error: error });
          retval.status = project.status;
        }

        // remove project.id from input list
        remainingProjectIds = remainingProjectIds.filter((projectId) => project.id !== projectId);
        return retval;
      }),
    );

    results.push(...currentResults);

    await sleep(SLEEP_INTERVAL);
    skip += TAKE_PER_PAGE;

    continueLooping = Boolean(paginatedResult.pageInfo.nextCursor && remainingProjectIds.length > 0);
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
