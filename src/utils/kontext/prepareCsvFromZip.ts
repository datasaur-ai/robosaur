import { mkdirSync, readdirSync, rmdirSync } from 'fs';
import { resolve } from 'path';
import { DocumentsConfig } from '../../config/interfaces';
import { createCsvFile } from './createCsvFile';
import { extractAllZipFiles } from './extractAllZipFiles';
import { getClientNames } from './getClientNames';
import { uploadFilesToCloudStorage } from './uploadFilesToCloudStorage';
import { validateKontext } from './validation/validateKontext';
import { deleteAllFilesFromDirectory } from './deleteAllFilesFromDirectory';

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

  const { inputPath: zipRootPath, uploadPath, containingFolder, source, bucketName } = documentConfig.kontext!;
  const stagingFolderPath = resolve(zipRootPath, 'staging');
  mkdirSync(stagingFolderPath);

  const clientNames = (await getClientNames(zipRootPath)).filter((file) => file.name !== 'staging');

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
