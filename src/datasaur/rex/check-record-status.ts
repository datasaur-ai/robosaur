import { TeamX } from '../../database/entities/teamPayloads/teamX.entity';
import { getTeamRepository } from '../../database/repository';
import { parseDate } from '../utils/parse-date';
import { JobCanceledError } from './errors/job-canceled-error';
import { OcrError } from './errors/ocr-error';
import { OCR_STATUS } from './interface';
const MAX_TIMEOUT_IN_MINUTES = Number(process.env.MAX_TIMEOUT_IN_MINUTES ?? 30);
export const checkRecordStatus = async (id: number) => {
  const saveKeepingRepo = await getTeamRepository<TeamX>();

  const saveKeeping = await saveKeepingRepo.findOne({ where: { _id: id } });

  if (!saveKeeping || saveKeeping.ocr_status === OCR_STATUS.STOPPED) {
    throw new JobCanceledError(id);
  }

  if (!saveKeeping || saveKeeping.ocr_status !== OCR_STATUS.IN_PROGRESS) {
    const timeInMinutes = _countTime(saveKeeping.start_ocr!);
    if (timeInMinutes && timeInMinutes >= MAX_TIMEOUT_IN_MINUTES) {
      throw new OcrError('document is re-queueing, marked as timeout', OCR_STATUS.TIMEOUT);
    }
  }
};

const _countTime = (recordTimestamp: string) => {
  if (!recordTimestamp) return;
  const recordTime = parseDate(recordTimestamp);
  const timeNow = new Date();

  const td = timeNow.getTime() - recordTime.getTime();
  return Math.floor(td / 1000 / 60);
};
