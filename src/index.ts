import { Command } from 'commander';
import packageJson from '../package.json';
import { handleCreateProject } from './handlers/create-project.handler';
import { handleCreateProjects } from './handlers/create-projects.handler';
import { getLogger } from './logger';

const program = new Command();

program.name(packageJson.name).version(packageJson.version);

program
  .command('create-project <projectName> <configFile>')
  .description('create a Datasaur project.')
  .action(handleCreateProject);

program
  .command('create-projects <configFile>')
  .option('--dry-run', 'Simulates what the script is doing without creating the projects')
  .description('Create Datasaur projects based on the given config file')
  .action(handleCreateProjects);

program.parseAsync(process.argv);

process.on('unhandledRejection', (error) => exitHandler('unhandledRejection', error));
process.on('uncaughtException', (error) => exitHandler('uncaughtException', error));

function exitHandler(event: string, error: any) {
  getLogger().error(`encountered ${event}`, { error: error.message });
  getLogger().on('finish', () => process.exit(-1));
}
