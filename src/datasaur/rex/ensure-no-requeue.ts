import { getTeamRepository } from '../../database/repository';
import { getLogger } from '../../logger';
import { OcrError } from './errors/ocr-error';
import { OCR_STATUS } from './interface';
import { isTimeout } from './is-timeout';

export const ensureNoRequeue = async (saveKeepingId: number) => {
  getLogger().info('Ensuring no re-queue');
  const saveKeepingRepo = await getTeamRepository();
  const saveKeepingDocument = await saveKeepingRepo.findOne({ where: { _id: saveKeepingId } });

  if (saveKeepingDocument) {
    const { ocr_status, start_ocr } = saveKeepingDocument;
    getLogger().info(`checking SaveKeeping document`, { status: ocr_status, start: start_ocr });
    const status: OCR_STATUS = ocr_status;

    if (status !== OCR_STATUS.IN_QUEUE && isTimeout(start_ocr)) {
      getLogger().warn('found a timed out process, removing the process...');
      getLogger().warn('The SaveKeeping document is re-enqueued, aborting job...');
      throw new OcrError('document is re-queueing, marked as timeout', OCR_STATUS.TIMEOUT);
    } else if (status !== OCR_STATUS.IN_QUEUE) {
      getLogger().warn('This error is caused by previous consumer error');
      throw new Error('This error is caused by previous consumer error');
    }
  }
};
