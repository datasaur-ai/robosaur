import { setConfigByJSONFile } from '../config/config';
import { getDatabaseValidators } from '../config/schema/validator';
import { initDatabase } from '../database';
import { Team15 } from '../database/entities/teamPayloads/team_15.entity';
import { startConsumer } from '../datasaur/start-consumer';
import { createConsumerHandlerContext, ProcessJob } from '../execution';
import { getLogger } from '../logger';

const dummyOrchestrator = (payload: Team15) => {
  getLogger().info(`Job ${payload.id} is being processed`);
};

export const handleStartConsumer = createConsumerHandlerContext(
  'start-consumer',
  _handleStartConsumer,
  dummyOrchestrator,
);

export async function _handleStartConsumer(process: ProcessJob<unknown[]>, configFile: string) {
  setConfigByJSONFile(configFile, getDatabaseValidators());
  initDatabase();

  await startConsumer(process);
}
