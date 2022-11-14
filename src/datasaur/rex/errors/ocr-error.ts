import { OCR_STATUS } from '../interface';

export class OcrError extends Error {
  status: OCR_STATUS;
  error: Error | string;
  constructor(error: Error | string, status: OCR_STATUS) {
    super(`${status}. ${error}`);
    this.status = status;
    this.error = error;
  }
}
