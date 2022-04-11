import { mkdirSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { DocumentsConfig } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { clearDirectory } from './clearDirectory';
import { createCsvFile } from './createCsvFile';
import { extractAllZipFiles } from './extractAllZipFiles';
import { getClientNames } from './getClientNames';
import { uploadFilesToCloudStorage } from './uploadFilesToCloudStorage';
import { validateKontext } from './validation/validateKontext';

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

export const handleFromZip = async (documentConfig: DocumentsConfig) => {
  validateKontext(documentConfig);

  const { zipRootPath, uploadPath, containingFolder, stagingFolderPath, source, bucketName } = documentConfig.kontext!;

  const clientNames = await getClientNames(zipRootPath);

  getLogger().info(`clearing ${stagingFolderPath} directory`);
  clearDirectory(stagingFolderPath);

  getLogger().info(`clearing ${documentConfig.path} directory`);
  clearDirectory(documentConfig.path);

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
};
