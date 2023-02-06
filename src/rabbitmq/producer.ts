import { connect } from './connect';
import { RabbitmqChannel } from './rabbitmq-channel';

export class Producer extends RabbitmqChannel {
  public static async create(host: string, queueName: string): Promise<Producer> {
    const consumer = new Producer(await connect(host), queueName);
    await consumer.initiateChannel();
    return consumer;
  }

  public sendMessage<T = any>(data: T): void {
    const stringifiedData = JSON.stringify(data);
    this.channel.sendToQueue(this.queueName, Buffer.from(stringifiedData), { persistent: true });
  }
}
