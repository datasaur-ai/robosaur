import { config } from 'dotenv';
config();

import { Command, InvalidOptionArgumentError } from 'commander';
import packageJson from '../package.json';
import { handleApplyTags } from './handlers/apply-tags.handler';
import { handleCreateProject } from './handlers/create-project.handler';
import { handleCreateProjects } from './handlers/create-projects.handler';
import { handleExportProjects } from './handlers/export-projects.handler';
import { handleRunConsumer } from './handlers/run-consumer';
import { handleSplitDocument } from './handlers/split-document.handler';
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
  .option('--without-pcw', 'Use legacy Robosaur configuration', false)
  .option('--use-pcw', 'Use the payload from Project Creation Wizard in Datasaur UI', true)
  .description('Create Datasaur projects based on the given config file')
  .action(handleCreateProjects);

program
  .command(`export-projects <configFile>`)
  .option('-u --unzip', 'Unzips the exported projects, only storing the final version accepted by reviewers')
  .option('--delete-project-after-export', 'Deletes project after export process has been completed')
  .description('Export all projects based on the given config file')
  .action(handleExportProjects);

program
  .command(`split-document <configFile>`)
  .description('Split document into multiple projects')
  .action(handleSplitDocument);

program
  .command(`apply-tags <configFile>`)
  .option(
    '--method <method>',
    'Update method between PUT and PATCH',
    (value) => {
      if (value !== 'PUT' && value !== 'PATCH') {
        throw new InvalidOptionArgumentError('The supported method is either PUT or PATCH');
      }
      return value;
    },
    'PUT',
  )
  .description('Applies tags to projects based on the given config file')
  .action(handleApplyTags);

program.command(`run-consumer <configFile>`).description('Run Consumer').action(handleRunConsumer);

program.parseAsync(process.argv);

process.on('unhandledRejection', (error) => exitHandler('unhandledRejection', error));
process.on('uncaughtException', (error) => exitHandler('uncaughtException', error));

function exitHandler(event: string, error: any) {
  getLogger().error(`encountered ${event}`, { ...error, error: error.message, stack: error.stack });
  getLogger().on('finish', () => process.exit(-1));
}
