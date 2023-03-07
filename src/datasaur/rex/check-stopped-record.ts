import { Repository } from 'typeorm';
import { StoppedRecord } from '../../database/entities/stopped-record.entity';
import { getRepository } from '../../database/repository';
import { getLogger } from '../../logger';
import { CancelState, getCancelStateMessage, Replacer } from './cancel-state';
import { JobCanceledError } from './errors/job-canceled-error';

type Repo = Repository<StoppedRecord>;

export async function checkStoppedRecord(teamId: number, saveKeepingId: number, error?: Error): Promise<boolean> {
  if (!isCanceledError(error)) return false;

  const repo = await getStoppedRepository();
  const stoppedRecord = await findStopped(repo, teamId, saveKeepingId);
  if (stoppedRecord) {
    const [message, meta] = getCanceledTextExtractionLogMessage(stoppedRecord);
    getLogger().info(message, meta);
    return true;
  }

  const cancelState = error.cancelState;
  const [message, meta] = getCanceledLogMessage(teamId, saveKeepingId, cancelState);
  getLogger().info(message, meta);
  return true;
}

async function getStoppedRepository(): Promise<Repo> {
  return getRepository(StoppedRecord);
}

async function findStopped(repo: Repo, teamId: number, saveKeepingId: number) {
  const stopped = await repo.findOne({ where: { team: teamId, _id: saveKeepingId } });
  return stopped;
}

function getCanceledTextExtractionLogMessage(stopped: StoppedRecord): [string, any] {
  const { _id: saveKeepingId, team: teamId, page } = stopped;
  const meta = { teamId };
  const replacer: Replacer = {
    id: String(saveKeepingId),
    page: String(page),
  };
  const message = getCancelStateMessage(CancelState.TEXT_EXTRACTION, replacer);
  return [message, meta];
}

function getCanceledLogMessage(teamId: number, saveKeepingId: number, cancelState: CancelState): [string, any] {
  const meta = { teamId };
  const replacer: Replacer = { id: String(saveKeepingId) };
  const message = getCancelStateMessage(cancelState, replacer);
  return [message, meta];
}

function isCanceledError(error?: Error): error is JobCanceledError {
  return error instanceof JobCanceledError;
}
