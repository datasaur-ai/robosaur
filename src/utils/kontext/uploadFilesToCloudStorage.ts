import { Dirent, readFileSync } from 'fs';
import Papa from 'papaparse';
import { resolve } from 'path';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../object-storage';

export const uploadFilesToCloudStorage = (
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

  imageDir.forEach((image) => {
    const fullPath = resolve(imagesPath, image.name);

    const fileContent = readFileSync(fullPath);

    storageClient.setFileContent(bucketName, `${uploadPath}/${clientName}/${projectName}/${image.name}`, fileContent);

    let endPoint = '';

    if (getConfig().documents.kontext?.source === StorageSources.AMAZONS3) {
      endPoint += getConfig().credentials[StorageSources.AMAZONS3].s3UseSSL ? 'https://' : 'http://';
      endPoint += `${getConfig().credentials[StorageSources.AMAZONS3].s3Endpoint}:`;
      endPoint += `${getConfig().credentials.s3.s3Port}`;
    } else if (getConfig().documents.kontext?.source === StorageSources.GOOGLE) {
      endPoint += 'https://storage.cloud.google.com';
    }

    csvObject.data.push([`${endPoint}/${bucketName}/${uploadPath}/${clientName}/${projectName}/${image.name}`]);
  });

  return Papa.unparse(csvObject);
};
