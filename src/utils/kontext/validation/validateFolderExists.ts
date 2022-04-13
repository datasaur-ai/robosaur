import { existsSync, mkdirSync } from 'fs';
import { getLogger } from '../../../logger';
import { FolderDoesntExist } from '../errors/folderDoesntExists';

export const validateFolderExists = (path: string, createIfNotExists = false) => {
  if (!existsSync(path)) {
    if (createIfNotExists) {
      getLogger().warn(`${path} folder doesn't exist, creating folder...`);

      mkdirSync(path, { recursive: true });
    } else {
      throw new FolderDoesntExist(path);
    }
  }
};
