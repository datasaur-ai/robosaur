import { Logger, createLogger } from 'winston';
import { getConfigFromEnvironment } from './logger.config';
import { LoggerService } from './logger-service';

export { loggerNamespace } from './logger-namespace';

let loggerService: LoggerService;

export function getLoggerService(config = getConfigFromEnvironment()): LoggerService {
  if (!loggerService) {
    loggerService = new LoggerService(createLogger(config));
  }
  return loggerService;
}

export function getLogger(): Logger {
  return getLoggerService().getLogger();
}
