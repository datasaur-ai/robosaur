import { Logger, createLogger } from 'winston';
import { getConfigFromEnvironment } from './logger.config';
import { LoggerService } from './logger-service';

export { loggerNamespace } from './logger-namespace';

let logger: Logger;

export function getLogger(config = getConfigFromEnvironment()): Logger {
  if (!logger) logger = createLogger(config);
  return logger;
}

let loggerService: LoggerService;

export function getLoggerService(config = getConfigFromEnvironment()): LoggerService {
  if (!loggerService) {
    loggerService = new LoggerService(createLogger(config));
  }
  return loggerService;
}
