import { CancelState } from '../cancel-state';
import { OCR_STATUS } from '../interface';
import { OcrError } from './ocr-error';

export class JobCanceledError extends OcrError {
  constructor(public saveKeepingId: number, public cancelState: CancelState) {
    super(`Job ${saveKeepingId} is cancelled by client`, OCR_STATUS.STOPPED);
  }
}
