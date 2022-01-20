import { basename } from 'path';
import { getStorageClient } from '../utils/object-storage';
import { RemoteDocument } from './interfaces';

export async function getObjectStorageDocuments(bucketName: string, prefix: string): Promise<RemoteDocument[]> {
  const storageClient = getStorageClient();
  const items = await storageClient.listItemsInBucket(bucketName, prefix);
  return Promise.all(
    items.map(async (item, index) => ({
      fileName: basename(item.name),
      externalImportableUrl: await storageClient.getObjectUrl(bucketName, item.name),
    })),
  );
}
