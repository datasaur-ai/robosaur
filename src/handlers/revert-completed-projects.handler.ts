import { readFileSync } from 'fs';
import { chunk, difference } from 'lodash';
import { setConfigByJSONFile } from '../config/config';
import { getProjects } from '../datasaur/get-projects';
import { ProjectStatus } from '../datasaur/interfaces';
import { toggleCabinetStatus } from '../datasaur/toggle-cabinet-status';
import { getLogger } from '../logger';
import { sleep } from '../utils/sleep';
import { ScriptAction } from './constants';

const TOGGLE_STATUS_POLLING_MS = 1500;

export const handleRevertCompletedProjectsToInReview = async (
  configFile: string,
  projectIdsFile: string,
  teamId: string,
) => {
  setConfigByJSONFile(configFile, [], ScriptAction.REVERT_PROJECT_STATUS);
  const projectIds = readFileSync(projectIdsFile, { encoding: 'utf8' })
    .split('\n')
    .map((e) => e.trim());

  const projects = await getProjects({ teamId: teamId, statuses: [ProjectStatus.COMPLETE] });

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

  for (const [idx, batch] of chunkedProjectIds.entries()) {
    const results = await Promise.all(
      batch.map(async (projectId) => ({ projectId, cabinetStatus: await toggleCabinetStatus(projectId) })),
    );
    if (results.some((res) => res.cabinetStatus.status !== ProjectStatus.IN_PROGRESS)) {
      getLogger().error(`Some projects failed to be reverted back to ${ProjectStatus.IN_PROGRESS}`);
    }
    getLogger().info(results.map((result) => ({ projectId: result.projectId, status: result.cabinetStatus.status })));

    if (idx !== chunkedProjectIds.length - 1) {
      sleep(TOGGLE_STATUS_POLLING_MS);
    }
  }
};
