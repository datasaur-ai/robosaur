import axios from 'axios';
import { Team15 } from '../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../database/repository';
import { OCR_STATUS, PAYLOAD_MESSAGE, PAYLOAD_STATUS } from '../datasaur/rex/interface';
import { getLogger } from '../logger';
import { sleep } from '../utils/sleep';

export async function sendRequestToEndpoint(id: number) {
  const team15Repository = await getRepository(Team15);
  const data = await team15Repository.findOneByOrFail(Number(id));
  const exportEndpoint = process.env.EXPORT_ENDPOINT;

  const payload = {
    document_data: data.document_data,
    document_path: data.hcp_ori_document_dir,
    transaction_id: data.id,
    status: isOCRSuccessful(data.ocr_status) ? PAYLOAD_STATUS.SUCCESS : PAYLOAD_STATUS.FAILED,
    message: {
      indonesian: `${
        isOCRSuccessful(data.ocr_status) ? PAYLOAD_MESSAGE.indonesia.SUCCESS : PAYLOAD_MESSAGE.indonesia.FAILED
      }`,
      english: `${isOCRSuccessful(data.ocr_status) ? PAYLOAD_MESSAGE.english.SUCCESS : PAYLOAD_MESSAGE.english.FAILED}`,
    },
    received_request: data.received_request,
    start_ocr: data.start_ocr,
    end_ocr: data.end_ocr,
    continuous_index: data.continuous_index,
  };

  let counterRetry = 0;
  const LIMIT_RETRY = Number(process.env.LIMIT_RETRY);
  while (counterRetry < LIMIT_RETRY) {
    try {
      getLogger().info(`sending request to ${exportEndpoint}...`, { payload });
      const response = await axios({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: payload,
        url: exportEndpoint,
        timeout: 30000,
      });
      counterRetry += LIMIT_RETRY;
      getLogger().info(`successfully sent payload to endpoint`, { response: response.data });
      return response;
    } catch (error) {
      if (counterRetry >= LIMIT_RETRY) {
        getLogger().error(`reached retry limit for sending OCR results to endpoint...`, {
          error: JSON.stringify(error),
          message: error.message,
        });
        return;
      } else {
        getLogger().warn(`error sending request, retrying...`, {
          error: JSON.stringify(error),
          message: error.message,
        });
        counterRetry += 1;
        sleep(1000);
      }
    }
  }
}

function isOCRSuccessful(ocr_status) {
  return ocr_status === OCR_STATUS.READ;
}
