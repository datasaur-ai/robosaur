import { ProcessJob } from '../execution';
import { getLogger } from '../logger';
import { random } from '../utils/random';
import { sleep } from '../utils/sleep';
import { createRecordAndReturnSaveKeeping } from './rex/create-record-and-return-save-keeping';
import { dequeueDocument } from './rex/dequeue-document';
import { validateRecord } from './rex/validate-record';

const MAX_DOCS = Number(process.env.MAX_DOCS ?? 3);

export const startConsumer = async (processJob: ProcessJob<unknown[]>, teamId: number) => {
  while (true) {
    const sleeptimeSecond = random(10) + 1;
    await sleep(sleeptimeSecond * 1000);

    const queueAvailable = await validateRecord(teamId, MAX_DOCS);

    if (!queueAvailable) {
      getLogger().info(`Team ${teamId} Max number of concurrent process is reached [MAX_DOCS: ${MAX_DOCS}]`);
      continue;
    }

    const document = await dequeueDocument(teamId);

    if (!document) {
      // only print the log at even sleep time
      if (sleeptimeSecond % 2 === 0) {
        getLogger().info(`Team ${teamId} No new document is found in the queue`);
      }
      continue;
    }

    const saveKeepingId = document.save_keeping_id;

    getLogger().info(`Team ${teamId} Reading document with ID: ${saveKeepingId}`);

    const saveKeeping = await createRecordAndReturnSaveKeeping(teamId, document);

    // Run Service
    getLogger().info(`Process Job Team ${teamId} and Save Keeping Id ${document.save_keeping_id}`);
    // trace id is using save_keeping_id, thats why teamId is the 2nd argument
    await processJob(`${document.save_keeping_id}`, teamId, saveKeeping);
  }
};
