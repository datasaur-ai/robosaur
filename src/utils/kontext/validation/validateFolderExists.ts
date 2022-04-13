import { existsSync, mkdirSync } from 'fs';
import { getLogger } from '../../../logger';
import { FolderNotFound } from '../errors/folderNotFound';

export const validateFolderExists = (path: string, createIfNotExists = false) => {
  if (!existsSync(path)) {
    if (createIfNotExists) {
      getLogger().warn(`${path} folder doesn't exist, creating folder...`);

      mkdirSync(path, { recursive: true });
    } else {
      throw new FolderNotFound(path);
    }
  }
};
