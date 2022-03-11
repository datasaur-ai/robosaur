import { getConfig } from '../config/config';
import { Config } from '../config/interfaces';
import { getLogger } from '../logger';
import { readJSONFile } from './readJSONFile';

export function getQuestionSetFromFile(config: Config) {
  const filepath = getConfig().project.questionSetFile;
  if (!filepath) {
    getLogger().warn('no questionSetFile is set');
    return [];
  }
  let content: any[] | null = null;
  try {
    content = readJSONFile(filepath);
  } catch (error) {
    getLogger().error(`fail to parse ${filepath}`, { error: JSON.stringify(error), message: error.message });
    throw new Error(`fail to parse ${filepath}`);
  }

  if (!content) throw new Error(`questionset is null`);
  return content;
}
