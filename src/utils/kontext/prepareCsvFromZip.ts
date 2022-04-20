import { existsSync, mkdirSync, readdirSync, rmdirSync } from 'fs';
import { resolve } from 'path';
import { DocumentsConfig } from '../../config/interfaces';
import { createCsvFile } from './createCsvFile';
import { extractAllZipFiles } from './extractAllZipFiles';
import { getClientNames } from './getClientNames';
import { uploadFilesToCloudStorage } from './uploadFilesToCloudStorage';
import { validateKontext } from './validation/validateKontext';
import { deleteAllFilesFromDirectory } from './deleteAllFilesFromDirectory';
import { validateFolderExists } from './validation/validateFolderExists';
import { getProgressBar } from '../progress-bar';

export const TEMP_FOLDER_NAME = '__temp__';

const createClientFolders = (
  client: {
    name: string;
    fullPath: string;
  },
  stagingFolderPath: string,
) => {
  const clientFolder = resolve(stagingFolderPath, client.name);

  mkdirSync(clientFolder);

  return clientFolder;
};

export const prepareCsvFromZip = async (documentConfig: DocumentsConfig) => {
  validateKontext(documentConfig);
  validateFolderExists(documentConfig.path, true);

  const {
    inputPath: zipRootPath,
    uploadPath,
    rootFolderPathInsideZip: containingFolder,
    source,
    bucketName,
  } = documentConfig.kontext!;

  const tempFolderPath = resolve(zipRootPath, TEMP_FOLDER_NAME);

  if (!existsSync(tempFolderPath)) {
    mkdirSync(tempFolderPath);
  } else {
    await deleteAllFilesFromDirectory([tempFolderPath]);
  }

  const clientNames = (await getClientNames(zipRootPath)).filter((file) => file.name !== TEMP_FOLDER_NAME);

  await deleteAllFilesFromDirectory([documentConfig.path], true);

  const bar = getProgressBar();

  for (const clientName of clientNames) {
    const clientFolder = createClientFolders(clientName, tempFolderPath);
    const directories = readdirSync(clientName.fullPath, { withFileTypes: true });

    for (const file of directories) {
      const projectFolder = resolve(clientFolder, file.name.replace(/\..*/, ''));

      extractAllZipFiles(file, projectFolder, clientName.fullPath);

      const imagesPath = resolve(projectFolder, containingFolder || '');
      const imagesFolder = readdirSync(imagesPath, { withFileTypes: true });

      bar.start(imagesFolder.length, 0, { task: `${clientName.name} - ${file.name.replace(/\..*/, '')}` });
      const csv = await uploadFilesToCloudStorage(
        uploadPath,
        source,
        bucketName,
        imagesPath,
        imagesFolder,
        clientName.name,
        file.name.replace(/\..*/, ''),
      );
      bar.stop();

      createCsvFile(documentConfig.path, clientName, file, csv);
    }
  }

  if (existsSync(tempFolderPath)) {
    await deleteAllFilesFromDirectory([tempFolderPath]);
    rmdirSync(tempFolderPath);
  }
};
