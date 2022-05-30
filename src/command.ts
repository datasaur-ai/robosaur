import { Command } from 'commander';
import packageJson from '../package.json';
import { handleCreateProject } from './handlers/create-project.handler';
import { handleCreateProjects } from './handlers/create-projects.handler';
import { handleExportProjects } from './handlers/export-projects.handler';

export const Program = new Command();

Program.name(packageJson.name).version(packageJson.version);

Program.command('create-project <projectName> <configFile>')
  .description('create a Datasaur project.')
  .action(handleCreateProject);

Program.command('create-projects <configFile>')
  .option('--dry-run', 'Simulates what the script is doing without creating the projects')
  .option('--without-pcw', 'Use legacy Robosaur configuration', false)
  .option('--use-pcw', 'Use the payload from Project Creation Wizard in Datasaur UI', true)
  .description('Create Datasaur projects based on the given config file')
  .action(handleCreateProjects);

Program.command(`export-projects <configFile>`)
  .option('-u --unzip', 'Unzips the exported projects, only storing the final version accepted by reviewers')
  .description('Export all projects based on the given config file')
  .action(handleExportProjects);
