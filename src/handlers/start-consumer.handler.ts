import { setConfigByJSONFile } from '../config/config';
import { getDatabaseValidators } from '../config/schema/validator';
import { initDatabase } from '../database';
import { HEALTH_STATUS } from '../datasaur/rex/interface';
import { orchestrateJob } from '../datasaur/rex/orchestrate-job';
import { startConsumer } from '../datasaur/start-consumer';
import { createConsumerHandlerContext, ProcessJob } from '../execution';
import { createHealthcheckServer } from '../healthcheck-server/create-healthcheck-server';
import { getLogger } from '../logger';

const startUp = (setHealthStatus: (status: HEALTH_STATUS) => void) => {
  process.on('SIGINT', () => {
    console.log('Process Interrupted');
    setHealthStatus(HEALTH_STATUS.STOPPED);
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('Killing Process');
    setHealthStatus(HEALTH_STATUS.STOPPED);
    process.exit(0);
  });
};

export const handleStartConsumer = createConsumerHandlerContext('start-consumer', _handleStartConsumer, orchestrateJob);

// TODO: deduplicate
export async function _handleStartConsumer(processJob: ProcessJob<unknown[]>, configFile: string) {
  const teamId = process.env.TEAM_ID;
  if (!teamId) {
    getLogger().error('Team Id not found in environment variables');
    return;
  }
  const { setHealthStatus, startApp: startHealthCheckServer } = await createHealthcheckServer(`consumer_${teamId}`);
  try {
    await startHealthCheckServer();
    startUp(setHealthStatus);
    setHealthStatus(HEALTH_STATUS.INITIAL);

    getLogger().info('Begin running consumer', { configFile });
    setConfigByJSONFile(configFile, getDatabaseValidators());
    initDatabase();

    setHealthStatus(HEALTH_STATUS.READY);

    await startConsumer(processJob, Number.parseInt(teamId), configFile);
  } catch (e) {
    getLogger().error(e.stack);
    setHealthStatus(HEALTH_STATUS.STOPPED);
  } finally {
    setHealthStatus(HEALTH_STATUS.STOPPED);
  }
}
