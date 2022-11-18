import { OCR_STATUS } from '../interface';
import { OcrError } from './ocr-error';

export class RecognizeDocumentError extends OcrError {
  constructor(error: Error) {
    super(error, OCR_STATUS.DOCUMENT_RECOGNITION_ERROR);
  }
}
