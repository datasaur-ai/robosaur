import { getConfig } from '../../config/config';
import { getLogger } from '../../logger';
import { ScriptState } from './script-state';

export async function getState() {
  try {
    return await ScriptState.fromConfig();
  } catch (error) {
    getLogger().error(`no statefile found in ${JSON.stringify(getConfig().projectState)}`);
    getLogger().info(`creating a new state`);
    return await createAndSaveNewState();
  }
}

async function createAndSaveNewState() {
  try {
    const state = new ScriptState();
    await state.save();
    return state;
  } catch (error) {
    getLogger().error(`fail in creating & saving new state file`);
    throw error;
  }
}
