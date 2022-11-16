import { DocumentQueueEntity } from '../../database/entities/document_queue.entity';
import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { getRepository } from '../../database/repository';
import { getLogger } from '../../logger';
import { updateSaveKeepingStatus } from './update-save-keeping-status';

export const createRecordAndReturnSaveKeeping = async (document: DocumentQueueEntity) => {
  const saveKeeping = await updateSaveKeepingStatus(document.save_keeping_id);

  const recordRepo = await getRepository(ProcessRecordEntity);
  const record = new ProcessRecordEntity(document.data);

  await recordRepo.insertOne(record);

  return saveKeeping;
};
