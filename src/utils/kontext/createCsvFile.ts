import { Dirent, mkdirSync, writeFileSync } from 'fs';

export const createCsvFile = (documentFolder: string, clientName, file: Dirent, csvFile: string) => {
  const docProjectFolder = `${documentFolder}/${clientName.name}_${file.name.replace(/\..*/, '')}`;

  mkdirSync(docProjectFolder);
  writeFileSync(`${docProjectFolder}/images_url.csv`, csvFile);
};
