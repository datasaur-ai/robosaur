import { BasePayload } from '../../database/entities/base-payload.entity';
import { HandlerContextCallback } from '../../execution';
import { saveExportResultsToDatabase } from '../../export/save-to-database';
import { handleCreateProjects } from '../../handlers/create-projects.handler';
import { handleExport } from '../../handlers/rex-export.handler';
import { getLogger } from '../../logger';
import { abortJob } from './abort-job';
import { checkRecordStatus } from './check-record-status';
import { cleanUpTempFolders } from './cleanUpTempFolders';
import { ensureNoRequeue } from './ensure-no-requeue';
import { ExportProjectError } from './errors/export-project-error';
import { OcrError } from './errors/ocr-error';
import { ProjectCreationError } from './errors/project-creation-error';
import { handleProjectCreationInputFiles } from './handle-project-creation-input-files';
import { OCR_STATUS } from './interface';
import { updateSaveKeepingStatus } from './update-save-keeping-status';

export const orchestrateJob: HandlerContextCallback<[number, any, string]> = async (
  teamId: number,
  saveKeepingId: number,
  configFile: string,
) => {
  getLogger().info(`Working on Team ID: ${teamId}`);

  const cleanUp = async (error: Error) => {
    // check handled error

    let status: OCR_STATUS;
    if (error instanceof OcrError) {
      status = error.status;
    } else {
      status = OCR_STATUS.UNKNOWN_ERROR;
    }

    await abortJob(teamId, saveKeepingId, `${status}`, error);
    getLogger().info(error.message, { stack: error.stack });

    cleanUpTempFolders();
  };

  const errorCallback = async (error: Error) => {
    await cleanUp(error);
    throw error;
  };

  try {
    await ensureNoRequeue(saveKeepingId);

    getLogger().info(`Team ${teamId} Update Save Keeping status to IN_PROGRESS`);
    const payload = (await updateSaveKeepingStatus(teamId, saveKeepingId)) as BasePayload;

    getLogger().info(`Process Job Team ${teamId} and Save Keeping Id ${saveKeepingId}`);

    getLogger().info(`Job ${saveKeepingId} started`);

    await checkRecordStatus(saveKeepingId);

    getLogger().info(`Job ${saveKeepingId} cleaning temporary folder`);
    cleanUpTempFolders();

    getLogger().info(`Job ${saveKeepingId} prepare input files`);
    // Call project creation input handler
    try {
      await handleProjectCreationInputFiles(payload);
    } catch (e) {
      await cleanUp(e);
      return;
    }

    await checkRecordStatus(saveKeepingId);
    getLogger().info(`Job ${saveKeepingId} creating projects`);
    // Run create-projects command and trigger ML-Assisted Labeling
    try {
      await handleCreateProjects(configFile, { dryRun: false, usePcw: true, withoutPcw: false }, errorCallback);
    } catch (e) {
      if (!(e instanceof OcrError)) {
        await cleanUp(new ProjectCreationError(e));
      }
      return;
    }

    await checkRecordStatus(saveKeepingId);
    getLogger().info(`Job ${saveKeepingId} exporting projects`);
    // Call project export
    try {
      await handleExport(configFile, payload, errorCallback);
    } catch (e) {
      if (!(e instanceof OcrError)) {
        await cleanUp(new ExportProjectError(e));
      }
      return;
    }

    await checkRecordStatus(saveKeepingId);

    try {
      getLogger().info(`Job ${saveKeepingId} saving result to database...`);
      await saveExportResultsToDatabase(teamId, saveKeepingId);
    } catch (e) {
      await cleanUp(e);
      return;
    }

    getLogger().info(`Job ${saveKeepingId} job finished. Cleaning up job`);

    await abortJob(teamId, saveKeepingId, OCR_STATUS.READ);
    cleanUpTempFolders();
  } catch (e) {
    await cleanUp(e);
    return;
  }
};
