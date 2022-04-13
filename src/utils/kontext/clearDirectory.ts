import { readdirSync, rmdirSync, unlinkSync } from 'fs';
import { resolve } from 'path';

export const clearDirectory = (dirPath: string) => {
  const dir = readdirSync(dirPath, { withFileTypes: true });
  dir.forEach((file) => {
    if (file.isFile()) {
      unlinkSync(resolve(dirPath, file.name));
    } else if (file.isDirectory()) {
      clearDirectory(resolve(dirPath, file.name));
      rmdirSync(resolve(dirPath, file.name));
    }
  });
};
