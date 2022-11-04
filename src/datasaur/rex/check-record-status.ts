import { getRepository } from '../../database/repository';
import { ProcessRecordEntity } from '../../database/entities/process_record.entity';

export const checkRecordStatus = async (id: number) => {
  const recordRepo = await getRepository(ProcessRecordEntity);

  const record = await recordRepo.findOne({ where: { data: { id } } });

  if (record) {
    return true;
  }

  return false;
};
