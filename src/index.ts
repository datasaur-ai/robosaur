import { Command } from 'commander';
import packageJson from '../package.json';
import { handleCreateProject } from './handlers/create-project.handler';
import { handleCreateProjects } from './handlers/create-projects.handler';
import { handleExportProjects } from './handlers/export-projects.handler';
import { handleExtractZip } from './handlers/extract-zip.handler';
import { getLogger } from './logger';

const program = new Command();

program.name(packageJson.name).version(packageJson.version);

program.command('extract-zip <configFile>').action(handleExtractZip);

program
  .command('create-project <projectName> <configFile>')
  .description('create a Datasaur project.')
  .action(handleCreateProject);

program
  .command('create-projects <configFile>')
  .option('--dry-run', 'Simulates what the script is doing without creating the projects')
  .option('--from-zip', 'Extract zip files and turn them into csv before creating project')
  .description('Create Datasaur projects based on the given config file')
  .action(handleCreateProjects);

program
  .command(`export-projects <configFile>`)
  .option('-u --unzip', 'Unzips the exported projects, only storing the final version accepted by reviewers')
  .description('Export all projects based on the given config file')
  .action(handleExportProjects);

program.parseAsync(process.argv);

process.on('unhandledRejection', (error) => exitHandler('unhandledRejection', error));
process.on('uncaughtException', (error) => exitHandler('uncaughtException', error));

function exitHandler(event: string, error: any) {
  getLogger().error(`encountered ${event}`, { ...error, error: error.message, stack: error.stack });
  getLogger().on('finish', () => process.exit(-1));
}
