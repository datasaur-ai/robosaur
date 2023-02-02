import { ProcessJob } from '../execution';
import { getLogger } from '../logger';
import { randbetween } from '../utils/randbetween';
import { wait } from '../utils/wait';
import { createRecordAndReturnSaveKeeping } from './rex/create-record-and-return-save-keeping';
import { dequeueDocument } from './rex/dequeue-document';
import { validateRecord } from './rex/validate-record';

const MAX_DOCS = Number(process.env.MAX_DOCS ?? 3);

let intervalId;

export const startConsumer = async (processJob: ProcessJob<unknown[]>, teamId: number) => {
  clearInterval(intervalId);
  const interval = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
  intervalId = setInterval(async function() {
    const queueAvailable = await validateRecord(teamId, MAX_DOCS);

    if (!queueAvailable) {
      getLogger().info(`Team ${teamId} Max number of concurrent process is reached [MAX_DOCS: ${MAX_DOCS}]`);
    }

    const document = await dequeueDocument(teamId);

    if (!document) {
      // only print the log at even sleep time
      if (interval % 2 === 0) {
        getLogger().info(`Team ${teamId} No new document is found in the queue`);
      }
    }

    const saveKeepingId = document.save_keeping_id;

    getLogger().info(`Team ${teamId} Reading document with ID: ${saveKeepingId}`);

    const saveKeeping = await createRecordAndReturnSaveKeeping(teamId, document);

    // Run Service
    getLogger().info(`Process Job Team ${teamId} and Save Keeping Id ${document.save_keeping_id}`);
    // trace id is using save_keeping_id, thats why teamId is the 2nd argument
    await processJob(`${document.save_keeping_id}`, teamId, saveKeeping);
  }, interval);
};
