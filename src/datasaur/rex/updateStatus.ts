import { getTeamRepository } from '../../database/repository';
import { OCR_STATUS } from './interface';

export const updateStatus = async (teamId: number, id: number, status: OCR_STATUS) => {
  const saveKeepingRepo = await getTeamRepository();
  const payload = await saveKeepingRepo.findOneOrFail({
    where: {
      _id: id,
    },
  });

  await saveKeepingRepo.update({ _id: payload._id }, { ocr_status: status });
};
