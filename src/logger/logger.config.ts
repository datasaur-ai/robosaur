import { resolve } from 'path';
import { format, LoggerOptions, transports } from 'winston';

export const getConfigFromEnvironment = () => {
  if (process.env.NODE_ENV === 'test') return loggerTestingConfig;
  return loggerDefaultConfig;
};

const loggerTestingConfig: LoggerOptions = {
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.json(),
    format.errors({ stack: true }),
  ),
  silent: false,
  exitOnError: true,
  transports: [new transports.File({ tailable: true, dirname: resolve(process.cwd(), 'logs') })],
};

const loggerDefaultConfig: LoggerOptions = {
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.json(),
    format.errors({ stack: true }),
  ),
  silent: false,
  exitOnError: true,
  transports: [
    new transports.File({ dirname: resolve(process.cwd(), 'logs'), tailable: true }),
    new transports.Console(),
  ],
};
