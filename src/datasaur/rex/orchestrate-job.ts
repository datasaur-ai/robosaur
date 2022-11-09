import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { handleCreateProjects } from '../../handlers/create-projects.handler';
import { getLogger } from '../../logger';
import { abortJob } from './abort-job';
import { checkRecordStatus } from './check-record-status';
import { JobCanceledError } from './errors/job-canceled-error';
import { OCR_STATUS } from './interface';

export const orchestrateJob = async (payload: Team15, configFile: string) => {
  try {
    const errorCallback = async (error: Error) => {
      getLogger().error('ErrorCallback called');
      await abortJob(payload, `${error.name}: ${error.message}`, error);
      throw error;
    };

    getLogger().info(`Job ${payload.id} started`);

    await checkRecordStatus(payload.id);
    getLogger().info(`Job ${payload.id} prepare input files`);
    // Call project creation input handler

    await checkRecordStatus(payload.id);
    getLogger().info(`Job ${payload.id} creating projects`);
    // Run create-projects command and trigger ML-Assisted Labeling
    try {
      await handleCreateProjects(configFile, { dryRun: false, usePcw: true, withoutPcw: false }, errorCallback);
    } catch (e) {
      return;
    }

    await checkRecordStatus(payload.id);
    // Call project export
    // Call post process

    getLogger().info(`Job ${payload.id} finishing job. Cleaning up job`);
    await abortJob(payload, OCR_STATUS.SUCCESS);
  } catch (e) {
    const error = e as JobCanceledError;
    await abortJob(payload, error.message, error);
    return;
  }
};
