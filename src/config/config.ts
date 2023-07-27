import { ScriptAction } from '../handlers/constants';
import { getLogger } from '../logger';
import { PCWPayload, PCWWrapper } from '../transformer/pcw-transformer/interfaces';
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
  overrideTeamIdFromConfig?: string,
) {
  getLogger().info(`reading config from: ${filePath}`);
  config = readJSONFile(filePath);
  if (validators.length === 0) getLogger().warn('config was set without validators');

  for (const validator of validators) {
    validator(config as Config);
  }

  if (overrideTeamIdFromConfig) {
    activeTeamId = overrideTeamIdFromConfig;
  } else {
    setActiveTeamId(context);
  }

  configPath = filePath;
}

export function getActiveTeamId() {
  if (!activeTeamId) throw new Error('config has not been set, cannot get activeTeamId');
  return activeTeamId;
}

function setActiveTeamId(context: ScriptAction) {
  switch (context) {
    case ScriptAction.TPT_REPORT:
      break;
    case ScriptAction.PROJECT_CREATION:
      activeTeamId =
        getConfig().create.teamId ||
        (getConfig().create.pcwPayload as PCWPayload).teamId ||
        (getConfig().create.pcwPayload as PCWWrapper).variables.input.teamId;
      break;
    case ScriptAction.PROJECT_EXPORT:
      activeTeamId = getConfig().export.teamId;
      break;
    case ScriptAction.APPLY_TAGS:
      activeTeamId = getConfig().applyTags.teamId;
      break;
    case ScriptAction.NONE:
      getLogger().warn('unspecified script context, attempt to set teamId automatically');
      const projectCreationTeam =
        getConfig().create.teamId ||
        (getConfig().create.pcwPayload as PCWPayload).teamId ||
        (getConfig().create.pcwPayload as PCWWrapper).variables.input.teamId;
      const projectExportTeam = getConfig().export?.teamId;
      const projectApplyTagsTeam = getConfig().applyTags?.teamId;
      activeTeamId = projectCreationTeam ?? projectExportTeam ?? projectApplyTagsTeam;
      break;
  }
}
