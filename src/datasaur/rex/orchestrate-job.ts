import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { handleCreateProjects } from '../../handlers/create-projects.handler';
import { handleExport } from '../../handlers/rex-export.handler';
import { getLogger } from '../../logger';
import { clearDirectory } from '../../utils/clearDirectory';
import { abortJob } from './abort-job';
import { checkRecordStatus } from './check-record-status';
import { JobCanceledError } from './errors/job-canceled-error';
import { handleProjectCreationInputFiles } from './handle-project-creation-input-files';
import { OCR_STATUS } from './interface';

export const orchestrateJob = async (payload: Team15, configFile: string) => {
  try {
    const errorCallback = async (error: Error) => {
      await abortJob(payload, `${error.name}: ${error.message}`, error);
      clearDirectory('temps');
      throw error;
    };

    getLogger().info(`Job ${payload.id} started`);

    await checkRecordStatus(payload.id);
    getLogger().info(`Job ${payload.id} prepare input files`);
    // Call project creation input handler
    try {
      await handleProjectCreationInputFiles(payload);
    } catch (e) {
      const error = e as Error;
      await abortJob(payload, error.message, error);
      clearDirectory('temps');
      return;
    }

    await checkRecordStatus(payload.id);
    getLogger().info(`Job ${payload.id} creating projects`);
    // Run create-projects command and trigger ML-Assisted Labeling
    try {
      await handleCreateProjects(configFile, { dryRun: false, usePcw: true, withoutPcw: false }, errorCallback);
    } catch (e) {
      return;
    }

    await checkRecordStatus(payload.id);
    getLogger().info(`Job ${payload.id} exporting projects`);
    // Call project export
    try {
      await handleExport(configFile, payload, errorCallback);
    } catch (e) {
      return;
    }

    await checkRecordStatus(payload.id);
    getLogger().info(`Job ${payload.id} applying post-processing`);
    // Call post process

    getLogger().info(`Job ${payload.id} finishing job. Cleaning up job`);
    await abortJob(payload, OCR_STATUS.SUCCESS);

    // Clean up temp folder
    clearDirectory('temps');
  } catch (e) {
    const error = e as JobCanceledError;
    await abortJob(payload, error.message, error);
    clearDirectory('temps');
    return;
  }
};
