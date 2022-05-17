import { StorageOptions } from '@google-cloud/storage';
import { ClientOptions } from 'minio';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';

export function getAzureBlobConfig() {
  return {
    connectionString: getConfig().credentials[StorageSources.AZURE].azureConnectionString,
    containerName: getConfig().credentials[StorageSources.AZURE].containerName,
  };
}

export function getGCSConfig(): StorageOptions {
  return {
    keyFilename: getConfig().credentials[StorageSources.GOOGLE].gcsCredentialJson,
  };
}

export function getMinioConfig(): ClientOptions {
  const s3Credentials = getConfig().credentials[StorageSources.AMAZONS3];
  return {
    endPoint: s3Credentials.s3Endpoint,
    port: s3Credentials.s3Port,
    accessKey: s3Credentials.s3AccessKey,
    secretKey: s3Credentials.s3SecretKey,
    useSSL: s3Credentials.s3UseSSL,
    // in some cases, Minio will throw S3: Access Denied when region is set to null
    // even when `aws s3 ls <bucket> returns correct results`
    region: s3Credentials.s3Region,
  };
}

export function normalizeFolderName(folder: string) {
  if (folder.length === 0) return folder;
  if (folder[folder.length - 1] !== '/') folder = folder + '/';
  return folder;
}

export function safeDirectoryName(directory: string) {
  // https://github.com/cthackers/adm-zip/pull/279
  // escape regex literal by using double backslashes
  // eslint-disable-next-line no-useless-escape
  return directory.replace(/[\\|\{\}\(\)\[\]\^\$\+\*\?\.@\/]/g, '_');
}
