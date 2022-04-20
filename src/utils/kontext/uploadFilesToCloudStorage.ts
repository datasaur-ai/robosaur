import { Dirent, readFileSync } from 'fs';
import Papa from 'papaparse';
import { resolve } from 'path';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../object-storage';
import { getProgressBar } from '../progress-bar';
import { StorageSourceNotSupportedError } from './errors/storageSourceNotSupported';

export const uploadFilesToCloudStorage = async (
  uploadPath: string,
  source: StorageSources,
  bucketName: string,
  imagesPath: string,
  imageDir: Dirent[],
  clientName: string,
  projectName: string,
) => {
  if (source === StorageSources.LOCAL) {
    getLogger().error('uploading to local storage is not supported');
    throw new Error('uploading to local storage is not supported');
  }

  const storageClient = getStorageClient(source);

  const csvObject: {
    fields: string[];
    data: Array<string[]>;
  } = {
    fields: ['url'],
    data: [],
  };

  for (const image of imageDir) {
    const fullPath = resolve(imagesPath, image.name);

    const fileContent = readFileSync(fullPath);

    await storageClient.setFileContent(
      bucketName,
      `${uploadPath}/${clientName}/${projectName}/${image.name}`,
      fileContent,
    );

    getProgressBar().increment();

    let endPoint = '';

    if (getConfig().documents.kontext?.source === StorageSources.AMAZONS3) {
      endPoint += getConfig().credentials[StorageSources.AMAZONS3].s3UseSSL ? 'https://' : 'http://';
      endPoint += `${getConfig().credentials[StorageSources.AMAZONS3].s3Endpoint}:`;
      endPoint += `${getConfig().credentials.s3.s3Port}`;
    } else if (getConfig().documents.kontext?.source === StorageSources.GOOGLE) {
      endPoint += 'https://storage.cloud.google.com';
    } else {
      throw new StorageSourceNotSupportedError(getConfig().documents.kontext?.source!, 'uploading files to cloud');
    }

    csvObject.data.push([`${endPoint}/${bucketName}/${uploadPath}/${clientName}/${projectName}/${image.name}`]);
  }

  return Papa.unparse(csvObject);
};
