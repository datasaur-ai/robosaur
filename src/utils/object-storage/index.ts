import { GoogleCloudStorageClient } from './google-cloud-storage';
import { ObjectStorageClient } from './interfaces';
import { S3CompatibleClient } from './minio';
import { StorageSources } from '../../config/interfaces';
import { getConfig } from '../../config/config';
import { AzureBlobStorageClient } from './azure-blob-storage';

const IMPLEMENTED_STORAGE_CLIENT = [StorageSources.AMAZONS3, StorageSources.GOOGLE];

export function getStorageClient(identifier = getConfig().create.files.source): ObjectStorageClient {
  switch (identifier) {
    case StorageSources.GOOGLE:
      return new GoogleCloudStorageClient();
    case StorageSources.AMAZONS3:
      return new S3CompatibleClient();
    case StorageSources.AZURE:
      return new AzureBlobStorageClient();
    default:
      throw new Error(
        `${identifier} client is not implemented. Please use one of this supported clients: ${JSON.stringify(
          IMPLEMENTED_STORAGE_CLIENT,
        )}`,
      );
  }
}
