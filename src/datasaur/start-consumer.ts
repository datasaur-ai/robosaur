import { ProcessJob } from "../execution";
import { getLogger } from "../logger";
import { randbetween } from "../utils/randbetween";
import { wait } from "../utils/wait";
import { createRecordAndReturnSaveKeeping } from "./rex/create-record-and-return-save-keeping";
import { dequeueDocument } from "./rex/dequeue-document";
import { validateRecord } from "./rex/validate-record";

const MAX_DOCS = Number(process.env.MAX_DOCS ?? 3);

export const startConsumer = async (
  processJob: ProcessJob<unknown[]>,
  teamId: number
) => {
  while (true) {
    const sleeptime = randbetween(0, 10);
    wait(sleeptime);

    const queueAvailable = await validateRecord(teamId, MAX_DOCS);

    if (!queueAvailable) {
      getLogger().info(
        `max number of concurrent process is reached [MAX_DOCS: ${MAX_DOCS}]`
      );
      continue;
    }

    const document = await dequeueDocument(teamId);

    if (!document) {
      getLogger().info(
        `no new document is found in the queue for team: ${teamId}`
      );
      continue;
    }

    const saveKeepingId = document.save_keeping_id;

    getLogger().info(`reading document with ID: ${saveKeepingId}`);

    const saveKeeping = await createRecordAndReturnSaveKeeping(document);

    // Run Service
    await processJob(`${document.save_keeping_id}`, teamId, saveKeeping);
  }
};
