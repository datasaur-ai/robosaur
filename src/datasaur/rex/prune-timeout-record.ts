import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../../database/repository';
import { getLogger } from '../../logger';
import { formatDate } from '../utils/format-date';
import { parseDate } from '../utils/parse-date';
import { OCR_STATUS } from './interface';

const MAX_TIMEOUT_IN_MINUTES = Number(process.env.MAX_TIMEOUT_IN_MINUTES ?? 30);

export const pruneTimeoutRecord = async (teamId: number) => {
  const recordRepo = await getRepository(ProcessRecordEntity);
  const records = await recordRepo.find({ where: { data: { team_id: teamId } } });

  for (const record of records) {
    const saveKeepingId = record.data?.id;

    const team15Repo = await getRepository(Team15);

    const saveKeeping = await team15Repo.findOne({ where: { id: saveKeepingId } });

    if (!saveKeeping || !saveKeeping.start_ocr) {
      continue;
    }

    const timeInMinutes = _countTime(saveKeeping.start_ocr);

    if (timeInMinutes >= MAX_TIMEOUT_IN_MINUTES) {
      getLogger().warn('found a timed out process, removing the process...');
      saveKeeping.end_ocr = formatDate(new Date());
      saveKeeping.ocr_status = OCR_STATUS.TIMEOUT;
      await team15Repo.save(saveKeeping);
      await recordRepo.delete(record);
    }
  }
};

const _countTime = (recordTimestamp: string) => {
  const recordTime = parseDate(recordTimestamp);
  const timeNow = new Date();

  const td = timeNow.getTime() - recordTime.getTime();
  return Math.floor(td / 1000 / 60);
};
