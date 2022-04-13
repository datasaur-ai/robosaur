import AdmZip from 'adm-zip';
import { Dirent, mkdirSync } from 'fs';
import { resolve } from 'path';

export const extractAllZipFiles = (file: Dirent, projectFolder: string, path: string) => {
  const zip = new AdmZip(resolve(path, file.name));

  mkdirSync(projectFolder);

  zip.extractAllTo(projectFolder, true);
};
