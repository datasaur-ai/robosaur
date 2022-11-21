import { readFileSync } from 'fs';
import { getConfig, setConfigByJSONFile } from '../config/config';
import { getUpdateFileTransformerValidators } from '../config/schema/validator';
import { updateFileTransformer } from '../datasaur/update-custom-script';
import { createSimpleHandlerContext } from '../execution';
import { getLogger } from '../logger';
import { ScriptAction } from './constants';

export const handleUpdateFileTransformer = createSimpleHandlerContext(
  'update-file-transformer',
  _handleUpdateFileTransformer,
);

async function _handleUpdateFileTransformer(configFile: string) {
  setConfigByJSONFile(configFile, getUpdateFileTransformerValidators(), ScriptAction.UPDATE_FILE_TRANSFORMER);

  const fileTransformerId = getConfig().updateFileTransformer.fileTransformerId;
  const path = getConfig().updateFileTransformer.path;

  getLogger().info(`reading file ${path}`);
  const content = readFileSync(path, { encoding: 'utf-8' });

  getLogger().info(`updating file transformer with id ${fileTransformerId}`);
  try {
    await updateFileTransformer(fileTransformerId, content);
    getLogger().info(`file transformer successfully updated`);
  } catch (error) {
    getLogger().error(`fail to update file transformer`, {
      error: JSON.stringify(error),
      message: error.message,
    });
  }
}
