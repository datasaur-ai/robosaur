import axios from 'axios';
import { getTeamRepository } from '../database/repository';
import { OCR_STATUS, PAYLOAD_MESSAGE, PAYLOAD_STATUS } from '../datasaur/rex/interface';
import { getLogger } from '../logger';
import { sleep } from '../utils/sleep';
import { base64Encode } from '../datasaur/utils/decode-encode';

export async function sendRequestToEndpoint(teamId: number, id: number) {
  const teamRepository = await getTeamRepository();
  const data = await teamRepository.findOneOrFail({
    where: {
      _id: id,
    },
  });
  getLogger().info(`Retrieved data from database for gateway payload`);
  const exportEndpoint = process.env.EXPORT_ENDPOINT;

  const payload = {
    document_data: data.document_data,
    document_path: data.hcp_ori_document_dir,
    transaction_id: data._id,
    status: isOCRSuccessful(data.ocr_status) ? PAYLOAD_STATUS.SUCCESS : PAYLOAD_STATUS.FAILED,
    message: {
      indonesian: `${PAYLOAD_MESSAGE.indonesia[data.ocr_status]}`,
      english: `${PAYLOAD_MESSAGE.english[data.ocr_status]}`,
    },
    received_request: data.received_request,
    start_ocr: data.start_ocr,
    end_ocr: data.end_ocr,
    continuous_index: data.continuous_index,
    filename: data.original_filename,
    team_id: teamId,
  };

  getLogger().info(`Payload to be sent`, { payload });

  let counterRetry = 0;
  const LIMIT_RETRY = Number(process.env.LIMIT_RETRY);
  const DELAY_RETRY = Number(process.env.DELAY_RETRY) || 1000;
  while (counterRetry < LIMIT_RETRY) {
    try {
      getLogger().info(`sending request to ${exportEndpoint}...`, {
        payload: base64Encode(JSON.stringify(payload)),
      });
      const response = await axios({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: payload,
        url: exportEndpoint,
        timeout: 30000,
      });
      counterRetry += LIMIT_RETRY;
      getLogger().info(`successfully sent payload to endpoint`, {
        response: base64Encode(JSON.stringify(response.data)),
      });
      return response;
    } catch (error) {
      if (counterRetry >= LIMIT_RETRY) {
        getLogger().error(
          `reached retry limit for sending OCR results to endpoint... updating the OCR status to SEND_GATEWAY_ERROR`,
          {
            error: JSON.stringify(error),
            message: error.message,
          },
        );
        await teamRepository.update({ _id: id }, { ocr_status: OCR_STATUS.SEND_GATEWAY_ERROR });
      } else {
        getLogger().warn(`error sending request, retrying...`, {
          error: JSON.stringify(error),
          message: error.message,
        });
        counterRetry += 1;
        sleep(DELAY_RETRY);
      }
    }
  }
}

function isOCRSuccessful(ocr_status) {
  return ocr_status === OCR_STATUS.READ;
}
