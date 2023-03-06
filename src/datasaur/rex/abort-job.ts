import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { getRepository, getTeamRepository } from '../../database/repository';
import { getLogger } from '../../logger';
import { sendRequestToEndpoint } from '../../export/send-request';
import { OCR_STATUS } from './interface';
import { formatDate } from '../utils/format-date';
import { checkStoppedRecord } from './check-stopped-record';
import { MongoRepository, ObjectLiteral } from 'typeorm';

export const abortJob = async (teamId: number, id: number, message: string, error?: Error) => {
  if (error) {
    getLogger().error(
      `Team ${teamId} Aborting job ${id} because of '${message}' detail error: ${JSON.stringify(error)}`,
    );
  } else {
    getLogger().info(`Team ${teamId} Aborting job ${id}. message: ${message}`);
  }

  const saveKeepingRepo = await getTeamRepository();
  const payload = await saveKeepingRepo.findOneOrFail({
    where: { _id: id },
  });

  await deleteProcessRecordIfExists(id);

  const isRecordStopped = await checkStoppedRecord(teamId, id);

  const isStatusInProgress = payload.ocr_status === OCR_STATUS.IN_PROGRESS;
  const isStatusRead = message === OCR_STATUS.READ;
  const shouldUpdateStatus = (isStatusInProgress || isStatusRead) && !isRecordStopped;

  if (shouldUpdateStatus) {
    await updateSaveKeepingOcrStatus(saveKeepingRepo, message, payload, teamId, id);
  } else {
    getLogger().info('Do not update ocr status.');
  }

  if (error) {
    getLogger().error(error.message);
  }
};

async function deleteProcessRecordIfExists(id: number) {
  const recordRepo = await getRepository(ProcessRecordEntity);
  const record = await recordRepo.findOneBy({ 'data.id': Number(id) });

  if (record) {
    getLogger().info(`Deleting record`, record);
    await recordRepo.delete(record);
  } else {
    getLogger().info(`Process record not found`);
  }
}

async function updateSaveKeepingOcrStatus(
  saveKeepingRepo: MongoRepository<ObjectLiteral>,
  message: string,
  payload: ObjectLiteral,
  teamId: number,
  id: number,
) {
  getLogger().info(`Updating save keeping. Updating ocr_status to ${message}`, payload);

  await saveKeepingRepo.update(
    { _id: id },
    { ocr_status: message, end_ocr: message !== OCR_STATUS.UNKNOWN_ERROR ? formatDate(new Date()) : null },
  );

  getLogger().info(`Updated save keeping`);

  if (![OCR_STATUS.UNKNOWN_ERROR, OCR_STATUS.STOPPED].map((status) => status.toString()).includes(message)) {
    // send any error except UNKNOWN_ERROR and STOPPED
    getLogger().info(`Job ${payload._id} sending result back to gateway...`);
    await sendRequestToEndpoint(teamId, payload._id);
  }
}
