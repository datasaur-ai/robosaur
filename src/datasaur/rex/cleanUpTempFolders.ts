import { clearDirectory } from '../../utils/clearDirectory';
import { existsSync, rmSync } from 'fs';
import { getConfig } from '../../config/config';

export const cleanUpTempFolders = () => {
  const statePath = getConfig().projectState.path;
  clearDirectory('temps');
  clearDirectory('sample/rex/export');
  if (existsSync(statePath)) {
    rmSync(statePath);
  }
};
