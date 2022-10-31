import { getLogger, getLoggerService, loggerNamespace } from '../logger';
import { createProcessWrapper } from '../logger/wrap-process';

const random = () => {
  return Math.floor(Math.random() * 5) + 1;
};

const contextKey = 'jobId';

// simulate consumer
function consumeDataFromDatabase(onJob: (jobId: number) => void | Promise<void>) {
  setInterval(() => {
    const randomJobId = random();
    onJob(randomJobId);
  }, 2000);
}

export async function handleRunConsumer(configFile: string) {
  getLoggerService().registerResolver(() => {
    return {
      command: 'run-consumer',
    };
  });

  const processWrapper = createProcessWrapper(contextKey);

  consumeDataFromDatabase(async (jobId: number) => {
    await processWrapper(
      () => jobId, // this is the context resolver, any value returned here will be printed to log
      async () => {
        getLogger().info('the context is available to any logger inside processWrapper.');
        setTimeout(() => {
          getLogger().info('job completed');
        }, 120);
      },
    );
  });
}
