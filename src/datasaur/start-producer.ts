import { ProcessJob } from '../execution';
import { getLogger } from '../logger';
import { Producer } from '../rabbitmq/producer';
import { random } from '../utils/random';
import { sleep } from '../utils/sleep';
import { moveDocumentToProcess } from './rex/dequeue-document';

export const startProducer = async (processJob: ProcessJob<[number, number, Producer]>, teamId: number) => {
  const queueHost = process.env.QUEUE_HOST ?? 'amqp://rabbitmq:5672';
  const producer = await Producer.create(queueHost, `process_record_${teamId}`);
  while (true) {
    const sleeptimeSecond = random(10) + 1;
    await sleep(sleeptimeSecond * 1000);

    const document = await moveDocumentToProcess(teamId);

    if (!document) {
      // only print the log at even sleep time
      if (sleeptimeSecond % 2 === 0) {
        getLogger().info(`Team ${teamId} No new document is found in the queue`);
      }
      continue;
    }

    const saveKeepingId = document.save_keeping_id;

    await processJob(`${document.save_keeping_id}`, teamId, saveKeepingId, producer);
  }
};
