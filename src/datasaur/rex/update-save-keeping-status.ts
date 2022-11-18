import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../../database/repository';
import { formatDate } from '../utils/format-date';
import { OCR_STATUS } from './interface';

export const updateSaveKeepingStatus = async (id: number) => {
  const currentTime = formatDate(new Date());

  const saveKeepingRepo = await getRepository(Team15);

  const saveKeeping = await saveKeepingRepo.findOne({
    where: {
      _id: id,
    },
  });

  if (!saveKeeping) {
    return null;
  }

  saveKeeping.start_ocr = currentTime;
  saveKeeping.ocr_status = OCR_STATUS.IN_PROGRESS;

  await saveKeepingRepo.update({ _id: saveKeeping._id }, saveKeeping);

  return saveKeeping;
};
