import { DocumentQueueEntity } from '../../database/entities/document_queue.entity';
import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { getRepository } from '../../database/repository';

export const moveDocumentToProcess = async (teamId: number) => {
  const queueRepo = await getRepository(DocumentQueueEntity);
  const recordRepo = await getRepository(ProcessRecordEntity);

  const document = await queueRepo.findOne({ where: { team: teamId } });

  if (!document) {
    return null;
  }

  const record = new ProcessRecordEntity(document.data);
  await recordRepo.insert(record);

  await queueRepo.delete(document);

  return document;
};
