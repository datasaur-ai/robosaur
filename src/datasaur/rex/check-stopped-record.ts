import { Repository } from 'typeorm';
import { StoppedRecord } from '../../database/entities/stopped.entity';
import { getRepository } from '../../database/repository';
import { getLogger } from '../../logger';

type Repo = Repository<StoppedRecord>;

export async function checkStoppedRecord(teamId: number, saveKeepingId: number) {
  const repo = await getStoppedRepository();
  const stoppedRecord = await findStopped(repo, teamId, saveKeepingId);
  if (stoppedRecord) {
    printStoppedInformation(stoppedRecord);
    return true;
  }
  return false;
}

async function getStoppedRepository(): Promise<Repo> {
  return getRepository(StoppedRecord);
}

async function findStopped(repo: Repo, teamId: number, saveKeepingId: number) {
  const stopped = await repo.findOne({ where: { team_id: teamId, save_keeping_id: saveKeepingId } });
  return stopped;
}

function printStoppedInformation({ team_id, save_keeping_id }: StoppedRecord) {
  const meta = {
    teamId: team_id,
    saveKeepingId: save_keeping_id,
  };
  const message = `Team ${team_id}, Savekeeping ${save_keeping_id} is stopped by user`;
  getLogger().info(message, meta);
}
