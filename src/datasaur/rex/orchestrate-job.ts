import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { handleCreateProjects } from '../../handlers/create-projects.handler';
import { abortJob } from './abort-job';
import { checkRecordStatus } from './check-record-status';

export const orchestrateJob = async (payload: Team15, configFile: string) => {
  const errorCallback = async (error: Error) => {
    await abortJob(payload, `${error.name}: ${error.message}`);
    throw error;
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
  try {
    await handleCreateProjects(configFile, { dryRun: false, usePcw: true, withoutPcw: false }, errorCallback);
  } catch (e) {
    return;
  }
  // Call project export
  // Call post process
};
