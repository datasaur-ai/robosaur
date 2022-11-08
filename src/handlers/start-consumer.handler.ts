import { setConfigByJSONFile } from '../config/config';
import { getDatabaseValidators } from '../config/schema/validator';
import { initDatabase } from '../database';
import { orchestrateJob } from '../datasaur/rex/orchestrate-job';
import { startConsumer } from '../datasaur/start-consumer';
import { createConsumerHandlerContext, ProcessJob } from '../execution';
import { getLogger } from '../logger';

export const handleStartConsumer = createConsumerHandlerContext('start-consumer', _handleStartConsumer, orchestrateJob);

export async function _handleStartConsumer(process: ProcessJob<unknown[]>, configFile: string) {
  getLogger().info('Begin running consumer', { configFile });
  setConfigByJSONFile(configFile, getDatabaseValidators());
  initDatabase();

  await startConsumer(process);
}
