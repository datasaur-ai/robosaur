import { validateConfigAssignment, validateConfigDocuments } from './schema/validator';
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

export function setConfigByJSONFile(filePath: string) {
  console.log(`Config from: ${filePath}`);
  config = readJSONFile(filePath);
  validateConfigAssignment(config as Config);
  validateConfigDocuments(config as Config);
  configPath = filePath;
}
