import { setConfigByJSONFile } from '../config/config';
import { getDatabaseValidators } from '../config/schema/validator';
import { initDatabase } from '../database';
import { startConsumer } from '../datasaur/start-consumer';

export async function handleStartConsumer(configFile: string) {
  setConfigByJSONFile(configFile, getDatabaseValidators());
  initDatabase();

  await startConsumer();
}
