import { StorageOptions } from '@google-cloud/storage';
import { ClientOptions } from 'minio';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';

export function getGCSConfig(): StorageOptions {
  return {
    keyFilename: getConfig().credentials[StorageSources.GOOGLE].gcsCredentialJson,
  };
}

export function getMinioConfig(): ClientOptions {
  return {
    endPoint: getConfig().credentials[StorageSources.AMAZONS3].s3Endpoint,
    port: getConfig().credentials[StorageSources.AMAZONS3].s3Port,
    accessKey: getConfig().credentials[StorageSources.AMAZONS3].s3AccessKey,
    secretKey: getConfig().credentials[StorageSources.AMAZONS3].s3SecretKey,
    useSSL: getConfig().credentials[StorageSources.AMAZONS3].s3UseSSL,
  };
}

export function normalizeFolderName(folder: string) {
  if (folder.length === 0) return folder;
  if (folder[folder.length - 1] !== '/') folder = folder + '/';
  return folder;
}
