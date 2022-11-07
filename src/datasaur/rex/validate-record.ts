import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { getRepository } from '../../database/repository';
import { SI_TEAM_ID } from './interface';
import { pruneTimeoutRecord } from './prune-timeout-record';

export const validateRecord = async (max_docs: number) => {
  await pruneTimeoutRecord(SI_TEAM_ID);
  const recordRepo = await getRepository(ProcessRecordEntity);
  const records = await recordRepo.find();
  if (records.length >= max_docs) {
    return false;
  }
  return true;
};
