import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../../database/repository';
import { OCR_STATUS } from './interface';

export const updateStatus = async (id: number, status: OCR_STATUS) => {
  const saveKeepingRepo = await getRepository(Team15);
  const payload = await saveKeepingRepo.findOneByOrFail(id);

  await saveKeepingRepo.update({ _id: payload._id }, { ocr_status: status });
};
