import { OCR_STATUS } from '../interface';
import { OcrError } from './ocr-error';

export class DownloadFileError extends OcrError {
  constructor(error: Error) {
    super(error, OCR_STATUS.DOWNLOAD_ERROR);
  }
}
