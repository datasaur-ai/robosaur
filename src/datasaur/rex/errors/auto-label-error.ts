import { OcrError } from './ocr-error';
import { OCR_STATUS } from '../interface';

export class AutoLabelError extends OcrError {
  constructor(jobError: string) {
    super(`ML-Assisted labeling API throws error: ${jobError}`, OCR_STATUS.FIELD_EXTRACTOR_ERROR);
  }
}
