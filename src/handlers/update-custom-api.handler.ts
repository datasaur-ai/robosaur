import { getConfig, setConfigByJSONFile } from '../config/config';
import { getUpdateCustomAPIValidators } from '../config/schema/validator';
import { updateCustomAPI } from '../datasaur/update-custom-api';
import { createSimpleHandlerContext } from '../execution';
import { getLogger } from '../logger';
import { ScriptAction } from './constants';

export const handleUpdateCustomAPI = createSimpleHandlerContext('update-custom-api', _handleUpdateCustomAPI);

async function _handleUpdateCustomAPI(configFile: string) {
  setConfigByJSONFile(configFile, getUpdateCustomAPIValidators(), ScriptAction.UPDATE_CUSTOM_API);

  const customAPIId = getConfig().updateCustomAPI.id;
  const name = getConfig().updateCustomAPI.name;
  const endpointURL = getConfig().updateCustomAPI.endpointURL;
  const secret = getConfig().updateCustomAPI.secret;

  getLogger().info(`updating custom API ${customAPIId}`);
  try {
    await updateCustomAPI(customAPIId, name, endpointURL, secret);
    getLogger().info(`custom API successfully updated`);
  } catch (error) {
    getLogger().error(`fail to update custom API`, {
      error: JSON.stringify(error),
      message: error.message,
    });
  }
}
