import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { getRepository } from '../../database/repository';
import { pruneTimeoutRecord } from './prune-timeout-record';

export const validateRecord = async (max_docs: number) => {
  await pruneTimeoutRecord();
  const recordRepo = await getRepository(ProcessRecordEntity);
  const records = await recordRepo.find();
  if (records.length >= max_docs) {
    return false;
  }
  return true;
};
