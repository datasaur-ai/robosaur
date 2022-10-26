import { resolve } from 'path';
import { format, LoggerOptions, transports } from 'winston';

const MAXIMUM_LOGFILE_SIZE = 10 * 1000 * 1000;
const MAXIMUM_LOGFILE_COUNT = 5;

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
    format.logstash(),
    format.errors({ stack: true }),
  ),
  silent: false,
  exitOnError: true,
  transports: [
    new transports.File({
      dirname: resolve(process.cwd(), 'logs'),
      maxsize: MAXIMUM_LOGFILE_SIZE,
      maxFiles: MAXIMUM_LOGFILE_COUNT,
    }),
  ],
};

const loggerDefaultConfig: LoggerOptions = {
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.logstash(),
    format.errors({ stack: true }),
  ),
  silent: false,
  exitOnError: true,
  transports: [
    new transports.File({
      dirname: resolve(process.cwd(), 'logs'),
      maxsize: MAXIMUM_LOGFILE_SIZE,
      maxFiles: MAXIMUM_LOGFILE_COUNT,
    }),
    new transports.Console(),
  ],
};
