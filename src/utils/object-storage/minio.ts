import { BucketItem as MinioBucketItem, Client } from 'minio';
import internal from 'stream';
import { streamToArray } from '../stream/streamToArray';
import { streamToString } from '../stream/streamToString';
import { getMinioConfig, normalizeFolderName } from './helper';
import { BucketItem, ObjectStorageClient } from './interfaces';

export class S3CompatibleClient implements ObjectStorageClient {
  static client: Client;

  static getClient(minioConfig = getMinioConfig(), override = false) {
    if (!S3CompatibleClient.client || override) S3CompatibleClient.client = new Client(minioConfig);
    return S3CompatibleClient.client;
  }

  async listSubfoldersOfPrefix(bucketName: string, rootPrefix = '') {
    const bucketItems: MinioBucketItem[] = await this.listKeysInBucket(bucketName, rootPrefix);
    return bucketItems.filter((item: BucketItem) => item.prefix).map((item) => item.prefix);
  }

  async listItemsInBucket(bucketName: string, folderName = ''): Promise<MinioBucketItem[]> {    
    const objects = await this.listKeysInBucket(bucketName, folderName)
    return objects.filter((item) => item.size > 0);
  }

  async listKeysInBucket(bucketName: string, folderName = ''): Promise<MinioBucketItem[]> {    
    const client = S3CompatibleClient.getClient();
    const objectStream = client.listObjects(bucketName, normalizeFolderName(folderName), false)
    return streamToArray(objectStream);
  }

  async getObjectUrl(bucketName: string, objectName: string) {
    return S3CompatibleClient.getClient().presignedUrl('get', bucketName, objectName);
  }

  async getStringFileContent(bucketName: string, objectPath: string): Promise<string> {
    const readableStream = await S3CompatibleClient.getClient().getObject(bucketName, objectPath);
    return streamToString(readableStream);
  }

  async setStringFileContent(bucketName: string, objectName: string, content: string): Promise<void> {
    await S3CompatibleClient.getClient().putObject(bucketName, objectName, content);
  }

  async setFileContent(bucketName: string, objectName: string, content: Buffer): Promise<void> {
    await S3CompatibleClient.getClient().putObject(bucketName, objectName, content);
  }
}
