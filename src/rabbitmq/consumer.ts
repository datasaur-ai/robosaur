import { Connection } from 'amqplib/callback_api';
import { getLogger } from '../logger';
import { connect } from './connect';
import { RabbitmqChannel } from './rabbitmq-channel';

export interface ConsumerCallback<T> {
  (message: T): Promise<void>;
}

export class Consumer<T> extends RabbitmqChannel {
  protected constructor(connection: Connection, queueName: string, public readonly consumerId: string) {
    super(connection, queueName);
  }

  public static async create<T>(host: string, queueName: string, consumerId: string): Promise<Consumer<T>> {
    const consumer = new Consumer<T>(await connect(host), queueName, consumerId);
    await consumer.initiateChannel(1);
    return consumer;
  }

  public startConsumer(callback: ConsumerCallback<T>) {
    this.channel.consume(
      this.queueName,
      async (message) => {
        try {
          if (!message) throw new Error('error parsing job message');
          const messageContent = message.content.toString();
          const body = JSON.parse(messageContent) as T;
          await callback(body);
          this.channel.ack(message);
        } catch (err) {
          getLogger().error(err);
        }
      },
      { noAck: false },
    );
  }
}
