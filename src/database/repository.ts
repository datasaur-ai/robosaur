import { EntityTarget, ObjectLiteral, MongoRepository } from 'typeorm';
import getDataSource from '.';

export async function getRepository<Type extends ObjectLiteral>(
  entity: EntityTarget<Type>,
): Promise<MongoRepository<Type>> {
  const databaseSource = await getDataSource();
  return databaseSource.getMongoRepository<Type>(entity);
}
