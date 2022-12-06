import { clearDirectory } from '../../utils/clearDirectory';
import { existsSync, rmSync } from 'fs';
import { getConfig } from '../../config/config';

export const cleanUpTempFolders = () => {
  if (process.env.DEBUG !== 'true') {
    const statePath = getConfig().projectState.path;
    clearDirectory('temps');
    clearDirectory('sample/rex/export');
    if (existsSync(statePath)) {
      rmSync(statePath);
    }
  }
};
