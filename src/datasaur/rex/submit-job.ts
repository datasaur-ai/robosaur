import { HandlerContextCallback } from '../../execution';
import { getLogger } from '../../logger';
import { Producer } from '../../rabbitmq/producer';

export const submitJob: HandlerContextCallback<[number, any, Producer]> = async (
  teamId: number,
  saveKeepingId: any,
  producer: Producer,
) => {
  getLogger().info(`Team ${teamId} Enqueueing document with ID: ${saveKeepingId}`);
  producer.sendMessage({ team_id: teamId, save_keeping_id: saveKeepingId });
  getLogger().info(`Team ${teamId} Document with ID: ${saveKeepingId} enqueued.`);
};
