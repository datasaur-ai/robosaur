import { Logger, createLogger } from 'winston';
import { getConfigFromEnvironment } from './logger.config';

let logger: Logger;

export function getLogger(config = getConfigFromEnvironment()): Logger {
  if (!logger) logger = createLogger(config);
  return logger;
}
