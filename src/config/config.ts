import { getLogger } from '../logger';
import { readJSONFile } from '../utils/readJSONFile';
import { Config } from './interfaces';

let config: Config | null = null;
let configPath: string | null = null;

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

export function setConfigByJSONFile(filePath: string, validators: Array<Function> = []) {
  getLogger().info(`reading config from: ${filePath}`);
  config = readJSONFile(filePath);
  if (validators.length === 0) getLogger().warn('config was set without validators');

  for (const validator of validators) {
    validator(config as Config);
  }

  configPath = filePath;
}
