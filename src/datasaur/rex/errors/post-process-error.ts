import { OCR_STATUS } from '../interface';
import { OcrError } from './ocr-error';

export class PostProcessError extends OcrError {
  constructor(error: Error) {
    super(error, OCR_STATUS.POST_PROCESS_ERROR);
  }
}
