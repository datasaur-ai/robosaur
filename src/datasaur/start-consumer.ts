import { ProcessJob } from '../execution';
import { Consumer } from '../rabbitmq/consumer';

interface ConsumerJob {
  team_id: number;
  save_keeping_id: number;
}

export const startConsumer = async (
  processJob: ProcessJob<[number, number, string]>,
  teamId: number,
  configFile: string,
) => {
  const appIndex = process.env.APP_INDEX ?? '0';
  const queueHost = process.env.QUEUE_HOST ?? 'amqp://rabbitmq:5672';
  const consumer = await Consumer.create<ConsumerJob>(queueHost, `process_record_${teamId}`, appIndex);

  await new Promise(() => {
    consumer.startConsumer(async (job: ConsumerJob) => {
      // trace id is using save_keeping_id, thats why teamId is the 2nd argument
      await processJob(`${job.save_keeping_id}`, teamId, job.save_keeping_id, configFile);
    });
  });
};
