import { ProcessJob } from '../execution';
import { getLogger } from '../logger';
import { randbetween } from '../utils/randbetween';
import { wait } from '../utils/wait';
import { createRecordAndReturnSaveKeeping } from './rex/create-record-and-return-save-keeping';
import { dequeueDocument } from './rex/dequeue-document';
import { SI_TEAM_ID } from './rex/interface';
import { validateRecord } from './rex/validate-record';

const MAX_DOCS = Number(process.env.MAX_DOCS ?? 3);

export const startConsumer = async (process: ProcessJob<unknown[]>) => {
  while (true) {
    const sleeptime = randbetween(0, 10);
    wait(sleeptime);

    const queueAvailable = await validateRecord(MAX_DOCS);

    if (!queueAvailable) {
      getLogger().info(`max number of concurrent process is reached [MAX_DOCS: ${MAX_DOCS}]`);
      continue;
    }

    const document = await dequeueDocument(SI_TEAM_ID);

    if (!document) {
      getLogger().info(`no new document is found in the queue`);
      continue;
    }

    const saveKeepingId = document.save_keeping_id;

    getLogger().info(`reading document with ID: ${saveKeepingId}`);

    const saveKeeping = await createRecordAndReturnSaveKeeping(document);

    // Run Service
    getLogger().info(`document ${saveKeeping?.filename} is currently in progress`);
    await process(`${document.id}`, saveKeeping);
  }
};
