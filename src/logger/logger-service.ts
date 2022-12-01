import { Logger } from 'winston';
import { LoggerContextResolver } from './interfaces';

export class LoggerService {
  protected resolvers: LoggerContextResolver[] = [];

  constructor(private logger: Logger) {}

  registerResolver(resolver: LoggerContextResolver) {
    this.resolvers.push(resolver);
  }

  popResolver() {
    this.resolvers.pop();
  }

  public error(message: string, ...args: any[]) {
    this.getLogger().error(message, ...args);
  }

  public warn(message: string, ...args: any[]) {
    this.getLogger().warn(message, ...args);
  }

  public log(message: string, ...args: any[]) {
    this.getLogger().info(message, ...args);
  }

  public info(message: string, ...args: any[]) {
    this.getLogger().info(message, ...args);
  }

  public verbose(message: string, ...args: any[]) {
    this.getLogger().verbose(message, ...args);
  }

  public debug(message: string, ...args: any[]) {
    this.getLogger().debug(message, ...args);
  }

  public silly(message: string, ...args: any[]) {
    this.getLogger().silly(message, ...args);
  }

  public getLogger(): Logger {
    let meta = {};
    this.resolvers.forEach((resolver) => {
      const context = resolver();
      if (context) {
        meta = { ...meta, ...context };
      }
    });
    return this.logger.child(meta);
  }
}
