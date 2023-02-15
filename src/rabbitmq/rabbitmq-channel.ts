import { Connection, Channel } from 'amqplib/callback_api';
import { getLogger } from '../logger';

export abstract class RabbitmqChannel {
  protected channel: Channel;

  protected constructor(private readonly connection: Connection, public readonly queueName: string) {}

  private createChannel(): Promise<Channel> {
    return new Promise((resolve, reject) => {
      this.connection.createChannel((error, channel) => {
        if (error) reject(error);
        else resolve(channel);
      });
    });
  }

  protected async initiateChannel(prefetch?: number) {
    this.channel = await this.createChannel();
    this.channel.assertQueue(this.queueName, { durable: true });
    if (prefetch !== null && prefetch !== undefined) {
      this.channel.prefetch(prefetch);
    }
  }

  protected setupOnConnectionClose() {
    this.channel.connection.on('error', (error) => {
      getLogger().error('RabbitMQ Connection error', { cause: error });
      process.exit(1);
    });

    this.channel.connection.on('close', (error) => {
      getLogger().error('RabbitMQ Connection closed', { cause: error });
      process.exit(1);
    });

    this.channel.on('error', (error) => {
      getLogger().error('RabbitMQ Channel error', { cause: error });
      process.exit(1);
    });

    this.channel.on('close', (error) => {
      getLogger().error('RabbitMQ Channel closed', { cause: error });
      process.exit(1);
    });
  }
}
