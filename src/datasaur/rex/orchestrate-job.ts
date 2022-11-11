import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { saveExportResultsToDatabase } from '../../export/save-to-database';
import { sendRequestToEndpoint } from '../../export/send-request';
import { handleCreateProjects } from '../../handlers/create-projects.handler';
import { handleExport } from '../../handlers/rex-export.handler';
import { getLogger } from '../../logger';
import { abortJob } from './abort-job';
import { checkRecordStatus } from './check-record-status';
import { cleanUpTempFolders } from './cleanUpTempFolders';
import { JobCanceledError } from './errors/job-canceled-error';
import { handleProjectCreationInputFiles } from './handle-project-creation-input-files';
import { OCR_STATUS } from './interface';
import { updateStatus } from './updateStatus';

export const orchestrateJob = async (payload: Team15, configFile: string) => {
  try {
    const errorCallback = async (error: Error) => {
      // let status: OCR_STATUS;
      // switch (error) {
      //   case error instanceof
      // }
      await abortJob(payload, `${error.name}: ${error.message}`, error);
      cleanUpTempFolders();
      throw error;
    };

    getLogger().info(`Job ${payload.id} started`);

    await checkRecordStatus(payload.id);
    getLogger().info(`Job ${payload.id} cleaning temporary folder`);
    cleanUpTempFolders();
    getLogger().info(`Job ${payload.id} prepare input files`);
    // Call project creation input handler
    try {
      await handleProjectCreationInputFiles(payload);
    } catch (e) {
      const error = e as Error;
      await abortJob(payload, error.message, error);
      cleanUpTempFolders();
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
      await updateStatus(payload, OCR_STATUS.READ);
    } catch (e) {
      return;
    } finally {
      // receives json format with reading_result and document_data
      await saveExportResultsToDatabase(payload.id);

      await sendRequestToEndpoint(payload.id);
    }

    getLogger().info(`Job ${payload.id} finishing job. Cleaning up job`);

    await abortJob(payload, OCR_STATUS.READ);
    // Clean up temp folder
    cleanUpTempFolders();
  } catch (e) {
    const error = e as JobCanceledError;
    await abortJob(payload, error.message, error);
    cleanUpTempFolders();
    return;
  }
};
