import { DocumentQueueEntity } from '../../database/entities/document_queue.entity';
import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { getRepository } from '../../database/repository';
import { updateSaveKeepingStatusToInProgress } from './update-save-keeping-status-to-in-progress';
import { getLogger } from '../../logger';

/**
 * @deprecated
 * @param teamId
 * @param document
 * @returns
 */
export const createRecordAndReturnSaveKeeping = async (teamId: number, document: DocumentQueueEntity) => {
  getLogger().info(`Team ${teamId} Create Record and Return Save Keeping`);
  const saveKeeping = await updateSaveKeepingStatusToInProgress(document.save_keeping_id);

  const recordRepo = await getRepository(ProcessRecordEntity);
  const record = new ProcessRecordEntity(document.data);

  await recordRepo.insertOne(record);

  return saveKeeping;
};
