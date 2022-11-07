import { DocumentQueueEntity } from '../../database/entities/document_queue.entity';
import { getRepository } from '../../database/repository';

export const dequeueDocument = async (teamId: number) => {
  const queueRepo = await getRepository(DocumentQueueEntity);

  const document = await queueRepo.findOne({ where: { team: teamId } });

  if (!document) {
    return null;
  }

  await queueRepo.delete(document);

  return document;
};
