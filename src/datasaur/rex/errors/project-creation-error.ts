import { OCR_STATUS } from '../interface';
import { OcrError } from './ocr-error';

export class ProjectCreationError extends OcrError {
  constructor(error: string) {
    super(`Error during project creation: ${error}`, OCR_STATUS.PROJECT_CREATION_ERROR);
  }
}
