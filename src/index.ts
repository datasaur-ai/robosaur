import { Program } from './command';
import { getLogger } from './logger';

Program.parseAsync(process.argv);

process.on('unhandledRejection', (error) => exitHandler('unhandledRejection', error));
process.on('uncaughtException', (error) => exitHandler('uncaughtException', error));

function exitHandler(event: string, error: any) {
  getLogger().error(`encountered ${event}`, { ...error, error: error.message, stack: error.stack });
  getLogger().on('finish', () => process.exit(-1));
}
