import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../../database/repository';
import { getLogger } from '../../logger';
import { formatDate } from '../utils/format-date';

export const abortJob = async (payload: Team15, message: string, error?: Error) => {
  const saveKeepingRepo = await getRepository(Team15);
  const recordRepo = await getRepository(ProcessRecordEntity);

  const record = await recordRepo.findOne({ where: { data: { id: payload.id } } });

  if (record) {
    recordRepo.delete(record);
  }

  saveKeepingRepo.save({ ...payload, end_ocr: formatDate(new Date()), ocr_status: message });

  if (error) {
    getLogger().error(error.message);
  }
};
