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
    printCanceledTextExtraction(stoppedRecord);
    return true;
  }

  const cancelState = error.cancelState;
  printCanceled(teamId, saveKeepingId, cancelState);
  return true;
}

async function getStoppedRepository(): Promise<Repo> {
  return getRepository(StoppedRecord);
}

async function findStopped(repo: Repo, teamId: number, saveKeepingId: number) {
  const stopped = await repo.findOne({ where: { team: teamId, _id: saveKeepingId } });
  return stopped;
}

function printCanceledTextExtraction(stopped: StoppedRecord) {
  const { _id: saveKeepingId, team: teamId, page } = stopped;
  const meta = { teamId, saveKeepingId };
  const replacer: Replacer = {
    id: String(saveKeepingId),
    page: String(page),
  };
  const message = getCancelStateMessage(CancelState.TEXT_EXTRACTION, replacer);
  getLogger().info(message, meta);
}

function printCanceled(team: number, saveKeepingId: number, cancelState: CancelState) {
  const meta = { team, saveKeepingId };
  const replacer: Replacer = { id: String(saveKeepingId) };
  const message = getCancelStateMessage(cancelState, replacer);
  getLogger().info(message, meta);
}

function isCanceledError(error?: Error): error is JobCanceledError {
  return error instanceof JobCanceledError;
}
