import { StorageOptions } from '@google-cloud/storage';
import { ClientOptions } from 'minio';
import { getConfig } from './../../config/config';

export function getGCSConfig(): StorageOptions {
  return {
    keyFilename: getConfig().documents.gcsCredentialJson,
  };
}

export function getMinioConfig(): ClientOptions {
  return {
    endPoint: getConfig().documents.s3Endpoint,
    port: getConfig().documents.s3Port,
    accessKey: getConfig().documents.s3AccessKey,
    secretKey: getConfig().documents.s3SecretKey,
    useSSL: getConfig().documents.s3UseSSl,
  };
}

export function normalizeFolderName(folder: string) {
  if (folder.length === 0) return folder;
  if (folder[folder.length - 1] !== '/') folder = folder + '/';
  return folder;
}

export function getBucketName(fullObjectPath: string) {
  const parts = fullObjectPath.split('//');
  const [bucket, ...rest] = parts[1].split('/');
  return bucket;
}

export function getObjectName(fullObjectPath: string) {
  const parts = fullObjectPath.split('//');
  const [bucket, ...rest] = parts[1].split('/');
  return rest.join('/');
}
