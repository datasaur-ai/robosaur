import { MongoRepository } from 'typeorm';
import { StoppedRecord } from '../../database/entities/stopped-record.entity';
import { getRepository } from '../../database/repository';
import { getLogger } from '../../logger';
import { BaseCron } from './base.cron';

type Repo = MongoRepository<StoppedRecord>;

export class DeleteOrphanStoppedRecords extends BaseCron {
  constructor() {
    super('0 0 * * *');
  }

  protected onRun = async () => {
    getLogger().info(`Running ${DeleteOrphanStoppedRecords.name}`);
    const deletedCount = await this.deleteAllOrphans();
    getLogger().info(`Deleted ${deletedCount} stopped records`);
  };

  private async getRepo(): Promise<Repo> {
    return getRepository(StoppedRecord);
  }

  private async deleteAllOrphans() {
    const repo = await this.getRepo();
    const result = await repo.deleteMany({});
    return result.deletedCount ?? 0;
  }
}
