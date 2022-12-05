import { BucketItem as MinioBucketItem, Client } from 'minio';
import { streamToArray } from '../stream/streamToArray';
import { streamToString } from '../stream/streamToString';
import { normalizeFolderName, getAwsS3Config } from './helper';
import { BucketItem, ObjectStorageClient } from './interfaces';
import * as path from 'path';
import { S3 } from 'aws-sdk';

const EXPIRED_IN_SECONDS = 3600;

const MULTI_PART_FILE_SIZE = 10 * 1024 * 1024;
const MULTI_PART_QUEUE_SIZE = 50;

export class AwsS3StorageClient implements ObjectStorageClient {
  static client: S3;

  static getClient(config = getAwsS3Config(), override = false) {
    return new S3(config);
  }

  async listSubfoldersOfPrefix(bucketName: string, rootPrefix = '') {
    const bucketItems: BucketItem[] = await this.listKeysInBucket(bucketName, rootPrefix);
    return bucketItems.filter((item: BucketItem) => item.prefix).map((item) => item.prefix!);
  }

  async listItemsInBucket(bucketName: string, folderName = ''): Promise<BucketItem[]> {
    const objects = await this.listKeysInBucket(bucketName, folderName);
    return objects.filter((item) => item.size ? item.size > 0 : false);
  }
  
  async listKeysInBucket(bucketName: string, folderName = ''): Promise<BucketItem[]> {
    const client = AwsS3StorageClient.getClient();
    const result: BucketItem[] = [];
    const prefix = normalizeFolderName(folderName);
    const response = await client.listObjectsV2({ Bucket: bucketName, Prefix: prefix }).promise();
    if (response.Contents) {
      for (const content of response.Contents) {
        if (content.Key) {
          result.push({
            prefix,
            size: content.Size,
            name: content.Key? path.basename(content.Key) : '',
          });
        }
      }
    }
    return result;
  }

  async getObjectUrl(bucketName: string, objectName: string) {
    return AwsS3StorageClient.getClient().getSignedUrlPromise('getObject',{
      Bucket: bucketName,
      Key: objectName,
      Expires: EXPIRED_IN_SECONDS,
    });
  }

  async getStringFileContent(bucketName: string, objectPath: string): Promise<string> {
    const request = await AwsS3StorageClient.getClient().getObject({ Bucket: bucketName, Key: objectPath });
    const readStream = request.createReadStream();
    readStream.on('close', () => request.abort());  
    return streamToString(readStream);
  }

  async setStringFileContent(bucketName: string, objectName: string, content: string): Promise<void> {
    const options = {
      partSize: MULTI_PART_FILE_SIZE,
      queueSize: MULTI_PART_QUEUE_SIZE,
    };
    await AwsS3StorageClient.getClient().upload({ Bucket: bucketName, Key: objectName, Body: content }, options).promise();
  }

  async setFileContent(bucketName: string, objectName: string, content: Buffer): Promise<void> {
    const options = {
      partSize: MULTI_PART_FILE_SIZE,
      queueSize: MULTI_PART_QUEUE_SIZE,
    };
    await AwsS3StorageClient.getClient().upload({ Bucket: bucketName, Key: objectName, Body: content }, options).promise();
  }
}
