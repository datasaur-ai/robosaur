import { EntityTarget, ObjectLiteral, MongoRepository } from 'typeorm';
import getDataSource from '.';
import { TeamX } from './entities/teamPayloads/teamX.entity';

export async function getRepository<Type extends ObjectLiteral>(
  entity: EntityTarget<Type>,
): Promise<MongoRepository<Type>> {
  const databaseSource = await getDataSource();
  return databaseSource.getMongoRepository<Type>(entity);
}

export async function getTeamRepository<Type extends ObjectLiteral>(): Promise<MongoRepository<Type>> {
  const databaseSource = await getDataSource();
  return databaseSource.getMongoRepository<Type>(TeamX);
}
