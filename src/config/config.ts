import { ScriptAction } from '../handlers/constants';
import { getLogger } from '../logger';
import { readJSONFile } from '../utils/readJSONFile';
import { Config } from './interfaces';

let config: Config | null = null;
let configPath: string | null = null;
let activeTeamId: string | null = null;

export function getConfigPath() {
  if (!configPath) {
    throw new Error('config is not set');
  }
  return configPath;
}

export function getConfig(): Config {
  if (!config) {
    throw new Error('config is not set');
  }
  return config;
}

export function setConfigByJSONFile(
  filePath: string,
  validators: Array<Function> = [],
  context: ScriptAction = ScriptAction.NONE,
) {
  getLogger().info(`reading config from: ${filePath}`);
  config = readJSONFile(filePath);
  if (validators.length === 0) getLogger().warn('config was set without validators');

  for (const validator of validators) {
    validator(config as Config);
  }

  setActiveTeamId(context);

  configPath = filePath;
}

export function getActiveTeamId() {
  if (!activeTeamId) throw new Error('config has not been set, cannot get activeTeamId');
  return activeTeamId;
}

function setActiveTeamId(context: ScriptAction) {
  switch (context) {
    case ScriptAction.PROJECT_CREATION:
      activeTeamId = getConfig().project.teamId;
      break;
    case ScriptAction.PROJECT_EXPORT:
      activeTeamId = getConfig().export.teamId;
    case ScriptAction.NONE:
      getLogger().warn('unspecified script context, attempt to set teamId automatically');
      const projectCreationTeam = getConfig().project?.teamId;
      const projectExportTeam = getConfig().export?.teamId;
      activeTeamId = projectCreationTeam ?? projectExportTeam;
      break;
  }
}
