import { OCR_STATUS } from '../interface';
import { OcrError } from './ocr-error';

export class ExportProjectError extends OcrError {
  constructor(error: string) {
    super(`Error during exporting project: ${error}`, OCR_STATUS.EXPORT_PROJECT_ERROR);
  }
}
