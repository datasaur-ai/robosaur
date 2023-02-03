import amqp, { Connection } from 'amqplib/callback_api';

export function connect(host: string): Promise<Connection> {
  return new Promise((resolve, reject) => {
    amqp.connect(host, (error, connection) => {
      if (error) reject(error);
      else resolve(connection);
    });
  });
}
