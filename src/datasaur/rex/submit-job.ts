import { HandlerContextCallback } from '../../execution';
import { getLogger } from '../../logger';
import { Producer } from '../../rabbitmq/producer';

export const submitJob: HandlerContextCallback<[number, number, Producer]> = async (
  teamId: number,
  saveKeepingId: number,
  producer: Producer,
) => {
  getLogger().info(`Team ${teamId} Enqueueing document with ID: ${saveKeepingId}`);
  producer.sendMessage({ team_id: teamId, save_keeping_id: saveKeepingId });
  getLogger().info(`Team ${teamId} Document with ID: ${saveKeepingId} enqueued.`);
};
