import { EntityTarget, ObjectLiteral } from 'typeorm';
import getDataSource from '.';

export async function getRepository(entity: EntityTarget<ObjectLiteral>) {
  const databaseSource = await getDataSource();
  return databaseSource.getMongoRepository(entity);
}
