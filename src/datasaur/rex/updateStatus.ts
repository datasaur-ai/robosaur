import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../../database/repository';
import { OCR_STATUS } from './interface';

export const updateStatus = async (payload: Team15, status: OCR_STATUS) => {
  const saveKeepingRepo = await getRepository(Team15);

  saveKeepingRepo.save({ ...payload, ocr_status: status });
};
