import { OCR_STATUS } from '../interface';
import { OcrError } from './ocr-error';

export class DeleteProjectError extends OcrError {
  constructor(error: string) {
    super(`Error during deleting project: ${error}`, OCR_STATUS.DELETE_PROJECT_ERROR);
  }
}
