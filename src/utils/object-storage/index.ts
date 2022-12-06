import { GoogleCloudStorageClient } from './google-cloud-storage';
import { ObjectStorageClient } from './interfaces';
import { StorageSources } from '../../config/interfaces';
import { getConfig } from '../../config/config';
import { AzureBlobStorageClient } from './azure-blob-storage';
import { AwsS3StorageClient } from './aws-s3-storage';

const IMPLEMENTED_STORAGE_CLIENT = [StorageSources.AMAZONS3, StorageSources.GOOGLE];

export function getStorageClient(identifier = getConfig().create.files.source): ObjectStorageClient {
  switch (identifier) {
    case StorageSources.GOOGLE:
      return new GoogleCloudStorageClient();
    case StorageSources.AMAZONS3:
      return new AwsS3StorageClient();
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
