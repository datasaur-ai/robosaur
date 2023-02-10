import { HEALTH_STATUS } from '../datasaur/rex/interface';
import { submitJob } from '../datasaur/rex/submit-job';
import { startProducer } from '../datasaur/start-producer';
import { createConsumerHandlerContext, ProcessJob } from '../execution';
import { createHealthcheckServer } from '../healthcheck-server/create-healthcheck-server';
import { getLogger } from '../logger';
import { Producer } from '../rabbitmq/producer';
import { getTeamId } from './producer-consumer/get-team-id';
import { initiateProcess } from './producer-consumer/initiate-process';

export const handleStartProducer = createConsumerHandlerContext<string[], [number, number, Producer]>(
  'start-producer',
  _handleStartProducer,
  submitJob,
);

export async function _handleStartProducer(processJob: ProcessJob<[number, number, Producer]>, configFile: string) {
  const teamId = getTeamId();
  const { setHealthStatus, startApp: startHealthcheckServer } = await createHealthcheckServer(`producer_${teamId}`);
  try {
    await initiateProcess('Producer', startHealthcheckServer, setHealthStatus, configFile);
    await startProducer(processJob, Number.parseInt(teamId));
  } catch (e) {
    getLogger().error(e.stack);
  } finally {
    setHealthStatus(HEALTH_STATUS.STOPPED);
  }
}
