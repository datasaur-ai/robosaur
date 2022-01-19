import { Logger, createLogger, format, transports } from 'winston';

let logger: Logger;

export function getLogger(level = 'info'): Logger {
  if (logger) return logger;

  logger = createLogger({
    level: level,
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.json(),
      format.errors({ stack: true }),
    ),
    silent: false,
    exitOnError: true,
  });
  logger.add(new transports.Console());

  return logger;
}
