import { clearDirectory } from '../../utils/clearDirectory';
import { existsSync, rmSync } from 'fs';

export const cleanUpTempFolders = () => {
  clearDirectory('temps');
  clearDirectory('sample/rex/export');
  if (existsSync('sample/rex/state.json')) {
    rmSync('sample/rex/state.json');
  }
};
