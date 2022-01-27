import { Storage } from '@google-cloud/storage';
import internal from 'stream';
import { getLogger } from '../../logger';
import { streamToString } from '../streamToString';
import { getGCSConfig, normalizeFolderName } from './helper';
import { BucketItem, ObjectStorageClient } from './interfaces';

const URL_EXPIRATION_DAYS = 1 * 24 * 60 * 60; // GCS v4 max is 7 days

export class GoogleCloudStorageClient implements ObjectStorageClient {
  static client: Storage;

  static getClient(gcsConfig = getGCSConfig(), override = false) {
    if (!GoogleCloudStorageClient.client || override) GoogleCloudStorageClient.client = new Storage(gcsConfig);

    return GoogleCloudStorageClient.client;
  }

  async listSubfoldersOfPrefix(bucketName: string, rootPrefix = ''): Promise<string[]> {
    const bucket = GoogleCloudStorageClient.getClient().bucket(bucketName);

    // "undocumented" way to get root folders only
    // https://stackoverflow.com/a/43829300
    const response = await bucket.getFiles({
      prefix: normalizeFolderName(rootPrefix),
      delimiter: '/',
      autoPaginate: false,
    });
    const folders = response[2].prefixes;
    return folders.map((folder: string) => folder);
  }

  async listItemsInBucket(bucketName: string, prefix: string): Promise<BucketItem[]> {
    const bucket = GoogleCloudStorageClient.getClient().bucket(bucketName);
    prefix = normalizeFolderName(prefix);
    const response = await bucket.getFiles({ prefix });
    return response[0].filter((file) => file.name !== prefix).map((file) => ({ name: file.name }));
  }

  async getObjectUrl(bucketName: string, objectName: string): Promise<string> {
    const url = await GoogleCloudStorageClient.getClient()
      .bucket(bucketName)
      .file(objectName)
      .getSignedUrl({
        action: 'read',
        expires: Date.now() + URL_EXPIRATION_DAYS,
        version: 'v4',
      });
    return url[0];
  }

  getStringFileContent(bucketName: string, objectName: string): Promise<string> {
    const objectStream = GoogleCloudStorageClient.getClient().bucket(bucketName).file(objectName).createReadStream();
    return streamToString(objectStream);
  }

  async setStringFileContent(bucketName: string, objectName: string, content: string): Promise<void> {
    await GoogleCloudStorageClient.getClient().bucket(bucketName).file(objectName).save(content);
  }

  async setFileContent(bucketName: string, objectName: string, content: internal.Readable): Promise<void> {
    return new Promise((resolve, reject) => {
      content.pipe(GoogleCloudStorageClient.getClient().bucket(bucketName).file(objectName).createWriteStream());
      content.on('finish', (arg) => {
        getLogger().info(`finished writing to GCS bucket`);
        resolve();
      });

      content.on('error', (error) => {
        getLogger().error(`error during writing to GCS bucket`, { error: { ...error, message: error.message } });
        reject();
      });
    });
  }
}
