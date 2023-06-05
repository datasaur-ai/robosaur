import { DataSource } from 'typeorm';
import { getConfig } from '../config/config';
import { getLogger } from '../logger';
import { sleep } from '../utils/sleep';

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

const RETRY_SLEEP_DURATION_MS = 180000; // 3 minutes

const getDataSource = async () => {
  if (databaseSource.isInitialized) {
    return databaseSource;
  }

  while (true) {
    try {
      await databaseSource.initialize();
      getLogger().info(`MongoDB has been initialized`);
      return databaseSource;
    } catch (err) {
      if (err.name !== 'MongoNetworkError') {
        getLogger().error(`MongoDB initialization error`, err);
        throw err;
      }

      getLogger().warn('MongoDB connection error, retrying connection in 3 minutes');
      await sleep(RETRY_SLEEP_DURATION_MS);
    }
  }
};

export default getDataSource;
