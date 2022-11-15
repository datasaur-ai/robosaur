import { OCR_STATUS } from '../interface';
import { OcrError } from './ocr-error';

export class JobCanceledError extends OcrError {
  constructor(job: number) {
    super(`Job ${job} is cancelled by client`, OCR_STATUS.STOPPED);
  }
}
