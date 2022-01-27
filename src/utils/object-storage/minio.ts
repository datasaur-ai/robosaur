import { Client, BucketItem as MinioBucketItem } from 'minio';
import { streamToArray } from '../streamToArray';
import { streamToString } from '../streamToString';
import { getMinioConfig, normalizeFolderName } from './helper';
import { BucketItem, ObjectStorageClient } from './interfaces';

export class S3CompatibleClient implements ObjectStorageClient {
  static client: Client;

  static getClient(minioConfig = getMinioConfig(), override = false) {
    if (!S3CompatibleClient.client || override) S3CompatibleClient.client = new Client(minioConfig);
    return S3CompatibleClient.client;
  }

  async listSubfoldersOfPrefix(bucketName: string, rootPrefix = '') {
    const bucketItems: MinioBucketItem[] = await this.listItemsInBucket(bucketName, rootPrefix);
    return bucketItems.filter((item: BucketItem) => item.prefix).map((item) => item.prefix);
  }

  async listItemsInBucket(bucketName: string, folderName = ''): Promise<MinioBucketItem[]> {
    const client = S3CompatibleClient.getClient();
    const objectStream = client.listObjects(bucketName, normalizeFolderName(folderName), false);
    return streamToArray(objectStream);
  }

  async getObjectUrl(bucketName: string, objectName: string) {
    return S3CompatibleClient.getClient().presignedUrl('get', bucketName, objectName);
  }

  async getFileContent(bucketName: string, objectPath: string): Promise<string> {
    const readableStream = await S3CompatibleClient.getClient().getObject(bucketName, objectPath);
    return streamToString(readableStream);
  }

  async setFileContent(bucketName: string, objectName: string, content: string): Promise<void> {
    await S3CompatibleClient.getClient().putObject(bucketName, objectName, content);
  }
}
