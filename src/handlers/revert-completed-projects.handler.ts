import { readFileSync } from 'fs';
import { chunk, difference } from 'lodash';
import { getActiveTeamId, getConfig, setConfigByJSONFile } from '../config/config';
import { RevertConfig, StorageSources } from '../config/interfaces';
import { getRevertProjectStatusValidator } from '../config/schema/revert-schema-validator';
import { getProjects } from '../datasaur/get-projects';
import { ProjectStatus } from '../datasaur/interfaces';
import { toggleCabinetStatus } from '../datasaur/toggle-cabinet-status';
import { getLogger } from '../logger';
import { getStorageClient } from '../utils/object-storage';
import { sleep } from '../utils/sleep';
import { ScriptAction } from './constants';

const TOGGLE_STATUS_POLLING_MS = 1500;

export const handleRevertCompletedProjectsToInReview = async (configFile: string) => {
  setConfigByJSONFile(configFile, getRevertProjectStatusValidator(), ScriptAction.REVERT_PROJECT_STATUS);
  const projectIds = await getProjectIds(getConfig().revert);
  const projects = await getProjects({ teamId: getActiveTeamId(), statuses: [ProjectStatus.COMPLETE] });

  // separate valid (project with COMPLETED status) and invalid project
  const validProject = projects.filter((p) => projectIds.includes(p.id));
  const validProjectIds = validProject.map((p) => p.id);

  const invalidProjectIds = difference([projectIds, validProjectIds]);

  getLogger().info(`Project with COMPLETED status: ${validProjectIds}`);
  if (invalidProjectIds.length > 0) {
    getLogger().warn(`Project with other status: ${invalidProjectIds}`);
    getLogger().warn(`Robosaur will only process projects with COMPLETE status`);
  }

  const chunkedProjectIds = chunk(validProjectIds, 5);

  const results: Array<{ projectId: string; status: string }> = [];
  for (const [idx, batch] of chunkedProjectIds.entries()) {
    const batchResult = await Promise.all(
      batch.map(async (projectId) => ({ projectId, cabinetStatus: await toggleCabinetStatus(projectId) })),
    );

    results.push(
      ...batchResult.map((result) => ({ projectId: result.projectId, status: result.cabinetStatus.status })),
    );

    if (idx !== chunkedProjectIds.length - 1) {
      sleep(TOGGLE_STATUS_POLLING_MS);
    }
  }

  if (results.length === 0 && validProject.length === 0) {
    // no results -> all projects provided are not COMPLETE yet
    getLogger().info('No valid projects are found.');
  } else {
    if (results.some((res) => res.status !== ProjectStatus.IN_PROGRESS)) {
      getLogger().error(`Some projects failed to be reverted back to ${ProjectStatus.IN_PROGRESS}`);
    }
    getLogger().info('Execution results', { data: results });
  }
};

async function getProjectIds(revertConfig: RevertConfig) {
  if (revertConfig.source === StorageSources.LOCAL) {
    const content = readFileSync(revertConfig.path, { encoding: 'utf8' });
    return content.split('\n').map((id) => id.trim());
  } else {
    const content = await getStorageClient().getStringFileContent(revertConfig.bucketName, revertConfig.path);
    return content.split('\n').map((id) => id.trim());
  }
}
