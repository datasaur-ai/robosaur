import { getTeamRepository } from '../../database/repository';
import { getLogger } from '../../logger';
import { parseDate } from '../utils/parse-date';
import { OcrError } from './errors/ocr-error';
import { OCR_STATUS } from './interface';
const MAX_TIMEOUT_IN_MINUTES = Number(process.env.MAX_TIMEOUT_IN_MINUTES ?? 30);

export const ensureNoRequeue = async (saveKeepingId: number) => {
  getLogger().info('Ensuring no re-queue');
  const saveKeepingRepo = await getTeamRepository();
  const saveKeepingDocument = await saveKeepingRepo.findOne({ where: { _id: saveKeepingId } });

  if (saveKeepingDocument) {
    const { ocr_status, start_ocr } = saveKeepingDocument;
    getLogger().info(`checking SaveKeeping document`, { status: ocr_status, start: start_ocr });
    const status: OCR_STATUS = ocr_status;
    const timeInMinutes = _countTime(start_ocr);

    if (status !== OCR_STATUS.IN_QUEUE && timeInMinutes && timeInMinutes >= MAX_TIMEOUT_IN_MINUTES) {
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
  if (!recordTimestamp) return;
  const recordTime = parseDate(recordTimestamp);
  const timeNow = new Date();

  const td = timeNow.getTime() - recordTime.getTime();
  return Math.floor(td / 1000 / 60);
};
