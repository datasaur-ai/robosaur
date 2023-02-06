import { ProcessJob } from '../execution';
import { getLogger } from '../logger';
import { Consumer } from '../rabbitmq/consumer';
import { sleep } from '../utils/sleep';

interface ConsumerJob {
  team_id: number;
  save_keeping_id: number;
}

export const startConsumer = async (processJob: ProcessJob<unknown[]>, teamId: number, configFile: string) => {
  const appIndex = process.env.APP_INDEX ?? '0';
  const queueHost = process.env.QUEUE_HOST ?? 'amqp://rabbitmq:5672';
  const consumer = await Consumer.create(queueHost, `process_record_${teamId}`, appIndex);

  await new Promise(() => {
    consumer.startConsumer(async (job: ConsumerJob) => {
      if (appIndex === '1') {
        getLogger().info('coba sleep 31 detik ' + job.save_keeping_id);
        await sleep(20_000);
      }

      // trace id is using save_keeping_id, thats why teamId is the 2nd argument
      await processJob(`${job.save_keeping_id}`, teamId, job.save_keeping_id, configFile);
    });
  });
};
