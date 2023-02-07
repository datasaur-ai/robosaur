import { DataSource } from 'typeorm';
import { getConfig } from '../config/config';
import { getLogger } from '../logger';

let databaseSource: DataSource;

export const initDatabase = () => {
  const config = getConfig();

  databaseSource = new DataSource({
    type: 'mongodb',
    url: config.database.url || undefined,
    host: !config.database.url ? config.database.host : undefined,
    port: !config.database.url ? config.database.port : undefined,
    username: !config.database.url ? config.database.username : undefined,
    password: !config.database.url ? config.database.password : undefined,
    database: config.database.database,
    authSource: config.database.authSource,
    synchronize: true,
    logging: false,
    entities: ['src/**/*.entity.{js,ts}'],
    migrations: ['src/migration/**/*.ts'],
  });
};

const getDataSource = async () => {
  if (!databaseSource.isInitialized) {
    try {
      await databaseSource.initialize();
      getLogger().info(`MongoDB has been initialized`);
      return databaseSource;
    } catch (err) {
      getLogger().error(`MongoDB initialization error`, err);
      // rethrow
      throw err;
    }
  }
  return databaseSource;
};

export default getDataSource;
