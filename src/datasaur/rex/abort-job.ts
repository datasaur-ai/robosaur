import { ProcessRecordEntity } from '../../database/entities/process_record.entity';
import { getRepository, getTeamRepository } from '../../database/repository';
import { getLogger } from '../../logger';
import { formatDate } from '../utils/format-date';

export const abortJob = async (teamId: number, id: number, message: string, error?: Error) => {
  if (error) {
    getLogger().error(`Aborting job ${id} because of '${message}' detail error: ${JSON.stringify(error)}`);
  } else {
    getLogger().info(`Aborting job ${id}. message: ${message}`);
  }
  const saveKeepingRepo = await getTeamRepository();
  const payload = await saveKeepingRepo.findOneOrFail({
    where: {
      _id: id,
    },
  });
  const recordRepo = await getRepository(ProcessRecordEntity);

  const record = await recordRepo.findOneBy({ 'data.id': Number(id) });

  if (record) {
    getLogger().info(`Deleting record`, record);

    await recordRepo.delete(record);
  } else {
    getLogger().info(`Process record not found`);
  }

  getLogger().info(`Updating save keeping. Adding end_ocr..`, payload);

  await saveKeepingRepo.update({ _id: payload._id }, { end_ocr: formatDate(new Date()), ocr_status: message });

  getLogger().info(`Updated save keeping`);

  if (error) {
    getLogger().error(error.message);
  }
};
