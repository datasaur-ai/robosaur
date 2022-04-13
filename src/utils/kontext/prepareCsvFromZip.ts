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

const TEMP_FOLDER_NAME = 'temp';

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
  const stagingFolderPath = resolve(zipRootPath, TEMP_FOLDER_NAME);
  if (!existsSync(stagingFolderPath)) {
    mkdirSync(stagingFolderPath);
  }

  const clientNames = (await getClientNames(zipRootPath)).filter((file) => file.name !== TEMP_FOLDER_NAME);

  deleteAllFilesFromDirectory([stagingFolderPath, documentConfig.path], true);

  clientNames.forEach((clientName) => {
    const clientFolder = createClientFolders(clientName, stagingFolderPath);
    const directories = readdirSync(clientName.fullPath, { withFileTypes: true });

    directories.forEach((file) => {
      const projectFolder = resolve(clientFolder, file.name.replace(/\..*/, ''));

      extractAllZipFiles(file, projectFolder, clientName.fullPath);

      const imagesPath = resolve(projectFolder, containingFolder || '');
      const imagesFolder = readdirSync(imagesPath, { withFileTypes: true });
      const csv = uploadFilesToCloudStorage(
        uploadPath,
        source,
        bucketName,
        imagesPath,
        imagesFolder,
        clientName.name,
        file.name.replace(/\..*/, ''),
      );

      createCsvFile(documentConfig.path, clientName, file, csv);
    });
  });

  deleteAllFilesFromDirectory([stagingFolderPath]);
  rmdirSync(stagingFolderPath);
};
