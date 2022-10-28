import { resolve } from 'path';
import { format, LoggerOptions, transports } from 'winston';
import 'winston-daily-rotate-file';

const MAXIMUM_LOGFILE_SIZE_BYTES = Number(process.env.MAXIMUM_LOGFILE_SIZE_BYTES ?? 10_000_000);
const MAXIMUM_LOGFILE_COUNT = Number(process.env.MAXIMUM_LOGFILE_COUNT ?? 5);

const DAILY_ROTATE_FILENAME = process.env.DAILY_ROTATE_FILENAME ?? 'winston-%DATE%.log';
const DAILY_ROTATE_DATE_PATTERN = process.env.DAILY_ROTATE_DATE_PATTERN ?? 'YYYY-MM-DD';

export const getConfigFromEnvironment = () => {
  if (process.env.NODE_ENV === 'test') return loggerTestingConfig;
  return loggerDefaultConfig;
};

const defaultDailyRotateTransport = new transports.DailyRotateFile({
  filename: DAILY_ROTATE_FILENAME,
  datePattern: DAILY_ROTATE_DATE_PATTERN,
  maxSize: MAXIMUM_LOGFILE_SIZE_BYTES,
  maxFiles: MAXIMUM_LOGFILE_COUNT,
  dirname: resolve(process.cwd(), 'logs'),
});

const defaultConsoleTransport = new transports.Console();

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
  transports: [defaultDailyRotateTransport, defaultConsoleTransport],
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
  transports: [defaultDailyRotateTransport, defaultConsoleTransport],
};
