import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { getRepository } from '../../database/repository';
import { pruneTimeoutRecord } from './prune-timeout-record';

export const validateRecord = async (teamId: number, maxDocs: number) => {
  await pruneTimeoutRecord(teamId);
  const recordRepo = await getRepository(ProcessRecordEntity);
  const records = await recordRepo.find();
  if (records.length >= maxDocs) {
    return false;
  }
  return true;
};
