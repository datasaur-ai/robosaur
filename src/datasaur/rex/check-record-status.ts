import { getRepository } from '../../database/repository';
import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { JobCanceledError } from './errors/job-canceled-error';
import { getLogger } from '../../logger';

export const checkRecordStatus = async (id: number) => {
  const recordRepo = await getRepository(ProcessRecordEntity);

  const record = await recordRepo.findOneBy({ 'data.id': id });

  if (!record) {
    throw new JobCanceledError(id);
  }
};
