import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { handleCreateProjects } from '../../handlers/create-projects.handler';
import { abortJob } from './abort-job';
import { checkRecordStatus } from './check-record-status';

export const orchestrateJob = async (payload: Team15, configFile: string) => {
  let isError = false;
  const errorCallback = async (name: string, msg: string) => {
    await abortJob(payload, `${name}: ${msg}`);
  };

  if (!(await checkRecordStatus(payload.id))) {
    await abortJob(payload, 'Job is cancelled by client');
    return;
  }
  // Call project creation input handler
  // Run create-projects command and trigger ML-Assisted Labeling
  if (!(await checkRecordStatus(payload.id))) {
    await abortJob(payload, 'Job is cancelled by client');
    return;
  }
  await handleCreateProjects(configFile, { dryRun: false, usePcw: true, withoutPcw: false }, errorCallback);
  // Call project export
  // Call post process
};
