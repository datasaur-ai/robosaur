import { TeamX } from '../../database/entities/teamPayloads/teamX.entity';
import { getTeamRepository } from '../../database/repository';
import { HandledError } from './errors/handled-error';
import { JobCanceledError } from './errors/job-canceled-error';
import { OCR_STATUS } from './interface';

export const checkRecordStatus = async (id: number) => {
  const saveKeepingRepo = await getTeamRepository<TeamX>();

  const saveKeeping = await saveKeepingRepo.findOne({ where: { _id: id } });

  if (!saveKeeping || saveKeeping.ocr_status === OCR_STATUS.STOPPED) {
    throw new JobCanceledError(id);
  } else {
    throw new HandledError();
  }
};
