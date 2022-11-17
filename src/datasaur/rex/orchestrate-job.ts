import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { saveExportResultsToDatabase } from '../../export/save-to-database';
import { sendRequestToEndpoint } from '../../export/send-request';
import { handleCreateProjects } from '../../handlers/create-projects.handler';
import { handleExport } from '../../handlers/rex-export.handler';
import { getLogger } from '../../logger';
import { abortJob } from './abort-job';
import { checkRecordStatus } from './check-record-status';
import { cleanUpTempFolders } from './cleanUpTempFolders';
import { ExportProjectError } from './errors/export-project-error';
import { OcrError } from './errors/ocr-error';
import { ProjectCreationError } from './errors/project-creation-error';
import { handleProjectCreationInputFiles } from './handle-project-creation-input-files';
import { OCR_STATUS } from './interface';
import { updateStatus } from './updateStatus';

export const orchestrateJob = async (payload: Team15, configFile: string) => {
  const cleanUp = async (error: Error) => {
    let status: OCR_STATUS;
    if (error instanceof OcrError) {
      status = error.status;
    } else {
      status = OCR_STATUS.UNKNOWN_ERROR;
    }
    await abortJob(payload._id, `${status}`, error);
    cleanUpTempFolders();
  };

  const errorCallback = async (error: Error) => {
    await cleanUp(error);
    throw error;
  };

  try {
    getLogger().info(`Job ${payload._id} started`);

    await checkRecordStatus(payload._id);

    getLogger().info(`Job ${payload._id} cleaning temporary folder`);
    cleanUpTempFolders();

    getLogger().info(`Job ${payload._id} prepare input files`);
    // Call project creation input handler
    try {
      await handleProjectCreationInputFiles(payload);
    } catch (e) {
      await cleanUp(e);
      return;
    }

    await checkRecordStatus(payload._id);
    getLogger().info(`Job ${payload._id} creating projects`);
    // Run create-projects command and trigger ML-Assisted Labeling
    try {
      await handleCreateProjects(configFile, { dryRun: false, usePcw: true, withoutPcw: false }, errorCallback);
    } catch (e) {
      if (!(e instanceof OcrError)) {
        await cleanUp(new ProjectCreationError(e));
      }
      return;
    }

    await checkRecordStatus(payload._id);
    getLogger().info(`Job ${payload._id} exporting projects`);
    // Call project export
    try {
      await handleExport(configFile, payload, errorCallback);
      await updateStatus(payload, OCR_STATUS.READ);
    } catch (e) {
      if (!(e instanceof OcrError)) {
        await cleanUp(new ExportProjectError(e));
      }
      return;
    }

    try {
      getLogger().info(`Job ${payload._id} saving result to database...`);
      await saveExportResultsToDatabase(payload._id);

      getLogger().info(`Job ${payload._id} sending result back to gateway...`);
      await sendRequestToEndpoint(payload._id);
    } catch (e) {
      await cleanUp(e);
      return;
    }

    getLogger().info(`Job ${payload._id} job finished. Cleaning up job`);

    await abortJob(payload._id, OCR_STATUS.READ);
    cleanUpTempFolders();
  } catch (e) {
    await cleanUp(e);
    return;
  }
};
