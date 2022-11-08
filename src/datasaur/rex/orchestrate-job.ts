import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { handleCreateProjects } from '../../handlers/create-projects.handler';
import { abortJob } from './abort-job';
import { checkRecordStatus } from './check-record-status';
import { JobCanceledError } from './errors/job-canceled-error';
import { OCR_STATUS } from './interface';

export const orchestrateJob = async (payload: Team15, configFile: string) => {
  try {
    const errorCallback = async (error: Error) => {
      await abortJob(payload, `${error.name}: ${error.message}`, error);
      throw error;
    };

    checkRecordStatus(payload.id);
    // Call project creation input handler

    checkRecordStatus(payload.id);
    // Run create-projects command and trigger ML-Assisted Labeling
    try {
      await handleCreateProjects(configFile, { dryRun: false, usePcw: true, withoutPcw: false }, errorCallback);
    } catch (e) {
      return;
    }

    checkRecordStatus(payload.id);
    // Call project export
    // Call post process

    await abortJob(payload, OCR_STATUS.SUCCESS);
  } catch (e) {
    const error = e as JobCanceledError;
    await abortJob(payload, error.message, error);
    return;
  }
};
