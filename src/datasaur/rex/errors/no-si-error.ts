import { OCR_STATUS } from '../interface';
import { OcrError } from './ocr-error';

export class NoSIError extends OcrError {
  constructor() {
    super('No SI document is found.', OCR_STATUS.NO_SI_ERROR);
  }
}
