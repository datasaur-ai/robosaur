import { OCR_STATUS } from '../interface';
import { OcrError } from './ocr-error';

export class SendGatewayError extends OcrError {
  constructor(error: Error) {
    super(error, OCR_STATUS.SEND_GATEWAY_ERROR);
  }
}
