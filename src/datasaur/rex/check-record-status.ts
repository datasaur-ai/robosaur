import { TeamX } from '../../database/entities/teamPayloads/teamX.entity';
import { getTeamRepository } from '../../database/repository';
import { JobCanceledError } from './errors/job-canceled-error';
import { OcrError } from './errors/ocr-error';
import { CancelState } from './cancel-state';
import { OCR_STATUS } from './interface';
import { isTimeout } from './is-timeout';

export const checkRecordStatus = async (id: number, cancelState: CancelState) => {
  const saveKeepingRepo = await getTeamRepository<TeamX>();

  const saveKeeping = await saveKeepingRepo.findOne({ where: { _id: id } });

  if (!saveKeeping || saveKeeping.ocr_status === OCR_STATUS.STOPPED) {
    throw new JobCanceledError(id, cancelState);
  }

  if (saveKeeping.ocr_status !== OCR_STATUS.IN_PROGRESS) {
    if (isTimeout(saveKeeping.start_ocr!)) {
      throw new OcrError('document process is timeout', OCR_STATUS.TIMEOUT);
    }
  }
};
