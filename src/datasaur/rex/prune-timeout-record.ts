import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { Team15 } from '../../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../../database/repository';
import { getLogger } from '../../logger';
import { formatDate } from '../utils/format-date';
import { parseDate } from '../utils/parse-date';

const MAX_MINUTES = 30;

export const pruneTimeoutRecord = async () => {
  const recordRepo = await getRepository(ProcessRecordEntity);
  const records = await recordRepo.find();

  for (const record of records) {
    const saveKeepingId = record.data?.id;

    const team15Repo = await getRepository(Team15);

    const saveKeeping = await team15Repo.findOne({ where: { id: saveKeepingId } });

    if (!saveKeeping || !saveKeeping.start_ocr) {
      continue;
    }

    console.log(saveKeeping.start_ocr);
    const timeInMinutes = _countTime(saveKeeping.start_ocr);
    console.log(timeInMinutes);

    if (timeInMinutes >= MAX_MINUTES) {
      getLogger().warn('found a timed out process, removing the process...');
      saveKeeping.end_ocr = formatDate(new Date());
      saveKeeping.ocr_status = 'Worker timeout on DYNAMIC-OCR';
      await team15Repo.save(saveKeeping);
      await recordRepo.delete(record);
    }
  }
};

const _countTime = (recordTimestamp: string) => {
  const recordTime = parseDate(recordTimestamp);
  console.log(
    `${recordTime.getFullYear()} ${recordTime.getMonth()} ${recordTime.getDate()} | ${recordTime.getHours()} ${recordTime.getMinutes()} ${recordTime.getSeconds()}`,
  );
  const timeNow = new Date();

  const td = timeNow.getTime() - recordTime.getTime();
  return Math.floor(td / 1000 / 60);
};
