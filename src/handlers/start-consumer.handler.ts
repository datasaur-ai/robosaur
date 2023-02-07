import { HEALTH_STATUS } from '../datasaur/rex/interface';
import { orchestrateJob } from '../datasaur/rex/orchestrate-job';
import { startConsumer } from '../datasaur/start-consumer';
import { createConsumerHandlerContext, ProcessJob } from '../execution';
import { createHealthcheckServer } from '../healthcheck-server/create-healthcheck-server';
import { getLogger } from '../logger';
import { getTeamId } from './producer-consumer/get-team-id';
import { initiateProcess } from './producer-consumer/initiate-process';

export const handleStartConsumer = createConsumerHandlerContext('start-consumer', _handleStartConsumer, orchestrateJob);

export async function _handleStartConsumer(processJob: ProcessJob<unknown[]>, configFile: string) {
  const teamId = getTeamId();
  const { setHealthStatus, startApp: startHealthcheckServer } = await createHealthcheckServer(`consumer_${teamId}`);
  try {
    await initiateProcess('Consumer', startHealthcheckServer, setHealthStatus, configFile);
    await startConsumer(processJob, Number.parseInt(teamId), configFile);
  } catch (e) {
    getLogger().error(e.stack);
  } finally {
    setHealthStatus(HEALTH_STATUS.STOPPED);
  }
}
