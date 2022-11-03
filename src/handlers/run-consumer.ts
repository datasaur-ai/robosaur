import { createConsumerHandlerContext, ProcessJob } from '../execution';
import { getLogger } from '../logger';

const random = () => {
  return Math.floor(Math.random() * 5) + 1;
};

interface Job {
  traceId: string;
  payload: string;
}

export const handleRunConsumer = createConsumerHandlerContext('run-consumer', _handleRunConsumer, processJob);

async function processJob(jobObject: any) {
  getLogger().info('begin job', jobObject);
  getLogger().info('the context is available to any logger inside processWrapper.');
  setTimeout(() => {
    getLogger().info('job completed');
  }, 120);
}

// simulate get job from database
export async function _handleRunConsumer(process: ProcessJob<unknown[]>, configFile: string) {
  getLogger().info('Begin running consumer', { configFile });
  setInterval(() => {
    const job: Job = { traceId: `${random()}`, payload: 'some-payload-data' };
    process(job.traceId, job);
  }, 2000);
}
