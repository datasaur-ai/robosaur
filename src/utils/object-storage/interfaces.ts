import internal from 'stream';

export interface ObjectStorageClient {
  listItemsInBucket(bucketName: string, prefix: string): Promise<BucketItem[]>;
  listSubfoldersOfPrefix(bucketname: string, rootPrefix?: string): Promise<string[]>;
  getObjectUrl(bucketName: string, objectName: string): Promise<string>;
  getStringFileContent(bucketName: string, objectName: string): Promise<string>;
  setStringFileContent(bucketName: string, objectName: string, content: string): Promise<void>;
  setFileContent(bucketName: string, objectName: string, content: internal.Readable): Promise<void>;
}

export interface BucketItem {
  name: string;
  prefix?: string;
}
