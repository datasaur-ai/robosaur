import { getTeamRepository } from '../../database/repository';
import { getLogger } from '../../logger';
import { parseDate } from '../utils/parse-date';
import { OcrError } from './errors/ocr-error';
import { OCR_STATUS } from './interface';
const MAX_TIMEOUT_IN_MINUTES = Number(process.env.MAX_TIMEOUT_IN_MINUTES ?? 30);

export const ensureNoRequeue = async (saveKeepingId: number) => {
  const saveKeepingRepo = await getTeamRepository();
  const saveKeepingDocument = await saveKeepingRepo.findOne({ where: { _id: saveKeepingId } });

  if (saveKeepingDocument) {
    const status: OCR_STATUS = saveKeepingDocument.ocr_status;

    const timeInMinutes = _countTime(saveKeepingDocument.start_ocr);

    if (status !== OCR_STATUS.IN_QUEUE && timeInMinutes >= MAX_TIMEOUT_IN_MINUTES) {
      getLogger().warn('found a timed out process, removing the process...');
      getLogger().warn('The SaveKeeping document is re-enqueued, aborting job...');
      throw new OcrError('document is re-queueing, marked as timeout', OCR_STATUS.TIMEOUT);
    } else if (status !== OCR_STATUS.IN_QUEUE) {
      getLogger().warn('This error is caused by previous consumer error');
      throw new Error('This error is caused by previous consumer error');
    }
  }
};

const _countTime = (recordTimestamp: string) => {
  const recordTime = parseDate(recordTimestamp);
  const timeNow = new Date();

  const td = timeNow.getTime() - recordTime.getTime();
  return Math.floor(td / 1000 / 60);
};
