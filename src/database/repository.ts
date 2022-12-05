import { EntityTarget, ObjectLiteral, MongoRepository, Entity } from 'typeorm';
import getDataSource from '.';
import { BasePayload } from './entities/base-payload.entity';

export async function getRepository<Type extends ObjectLiteral>(
  entity: EntityTarget<Type>,
): Promise<MongoRepository<Type>> {
  const databaseSource = await getDataSource();
  return databaseSource.getMongoRepository<Type>(entity);
}

export async function getTeamRepository(teamId: number): Promise<MongoRepository<BasePayload>> {
  const databaseSource = await getDataSource();
  return databaseSource.getMongoRepository<BasePayload>(createTeamEntity(teamId + ''));
}

export function createTeamEntity(teamName: string) {
  @Entity({ name: teamName })
  class TeamEntityClass extends BasePayload {}

  return TeamEntityClass;
}
