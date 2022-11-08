import axios from 'axios';
import { setConfigByJSONFile } from '../config/config';
import { getDatabaseValidators } from '../config/schema/validator';
import { initDatabase } from '../database';
import { Team15 } from '../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../database/repository';
import { getLogger } from '../logger';
import { sleep } from '../utils/sleep';
import { OCR_STATUS } from './constants';

export async function sendRequestToEndpoint(configFile: string, id: number) {
  setConfigByJSONFile(configFile, getDatabaseValidators());
  initDatabase();
  const team15Repository = await getRepository(Team15);
  const data = await team15Repository.findOneByOrFail(Number(id));
  const exportEndpoint = process.env.EXPORT_ENDPOINT;

  const payload = {
    document_data: data.document_data,
    document_path: data.hcp_ori_document_dir,
    transaction_id: data.id,
    status: isOCRSuccessful(data.ocr_status) ? OCR_STATUS.SUCCESS : OCR_STATUS.FAILED,
    message: {
      indonesian: `OCR ${isOCRSuccessful(data.ocr_status) ? OCR_STATUS.BERHASIL : OCR_STATUS.GAGAL}`,
      english: `OCR ${isOCRSuccessful(data.ocr_status) ? OCR_STATUS.SUCCESS : OCR_STATUS.FAILED}`,
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
      const response = await axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: payload,
        url: exportEndpoint,
        timeout: 30000,
      });
      counterRetry += LIMIT_RETRY;
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
