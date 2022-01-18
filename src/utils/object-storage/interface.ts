export interface ObjectStorageClient {
  listItemsInBucket(bucketName: string, prefix: string): Promise<BucketItem[]>;
  listSubfoldersOfPrefix(bucketname: string, rootPrefix?: string): Promise<string[]>;
  getObjectUrl(bucketName: string, objectName: string): Promise<string>;
  getFileContent(bucketName: string, objectName: string): Promise<string>;
  setFileContent(bucketName: string, objectName: string, content: string): Promise<void>;
}

export interface BucketItem {
  name: string;
  prefix?: string;
}
