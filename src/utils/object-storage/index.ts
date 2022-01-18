import { GoogleCloudStorageClient } from './google-cloud-storage';
import { ObjectStorageClient } from './interface';
import { S3CompatibleClient } from './minio';
import { StorageSources } from '../../config/interfaces';
import { getConfig } from '../../config/config';

export function getStorageClient(identifier = getConfig().documents.source): ObjectStorageClient {
  switch (identifier) {
    case StorageSources.GOOGLE:
      return new GoogleCloudStorageClient();
    case StorageSources.AMAZONS3:
      return new S3CompatibleClient();
    default:
      throw new Error(`${identifier} client is not implemented`);
      break;
  }
}
