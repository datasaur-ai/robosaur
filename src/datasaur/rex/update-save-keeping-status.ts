import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../../database/repository';
import { formatDate } from '../utils/format-date';

export const updateSaveKeepingStatus = async (id: number) => {
  const currentTime = formatDate(new Date());

  const saveKeepingRepo = await getRepository(Team15);

  const saveKeeping = await saveKeepingRepo.findOne({
    where: {
      id,
    },
  });

  if (!saveKeeping) {
    return null;
  }

  saveKeeping.start_ocr = currentTime;
  saveKeeping.ocr_status = 'In Progress';
  saveKeepingRepo.save(saveKeeping);

  return saveKeeping;
};
