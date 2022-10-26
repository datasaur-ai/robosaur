import { getLoggerService, loggerNamespace } from '../logger';

const random = () => {
  return Math.floor(Math.random() * 5) + 1;
};

function registerLoggerResolver() {
  getLoggerService().registerResolver(() => {
    const resolved = loggerNamespace.get('jobId');
    return {
      jobId: resolved,
    };
  });
}

function setJobId(jobId: string) {
  loggerNamespace.set('jobId', jobId);
}

// simulate consumer
function consumeDataFromDatabase(onJob: (jobId: number) => void | Promise<void>) {
  setInterval(() => {
    const delayedSecond = random();
    loggerNamespace.run(() => {
      setJobId(`${delayedSecond}-${Math.random()}`);
      onJob(delayedSecond);
    });
  }, 2000);
}

export async function handleRunConsumer(configFile: string) {
  registerLoggerResolver();

  consumeDataFromDatabase((jobId) => {
    // get logger instance
    const logger = getLoggerService().getLogger();

    // test logging
    logger.info(`running ${jobId} second job`);

    // simulate job complete
    setTimeout(() => {
      // test logging
      logger.info(`completed ${jobId} second job`);
    }, jobId * 1000);
  });
}
