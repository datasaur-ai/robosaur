import { BlobServiceClient as Client } from '@azure/storage-blob';
import { getAzureBlobConfig } from './helper';
import { BucketItem, ObjectStorageClient } from './interfaces';

export class AzureBlobStorageClient implements ObjectStorageClient {
  static client: Client;
  static containerClient;
  static getClient(azureConfig = getAzureBlobConfig(), override = false) {
    if (!AzureBlobStorageClient.client || override)
      AzureBlobStorageClient.client = Client.fromConnectionString(azureConfig.connectionString);
    return AzureBlobStorageClient.client;
  }

  static getContainerClient(containerName: string, override = false) {
    const blobServiceClient = AzureBlobStorageClient.getClient();
    if (!AzureBlobStorageClient.containerClient || override)
      AzureBlobStorageClient.containerClient = blobServiceClient.getContainerClient(containerName);
    return AzureBlobStorageClient.containerClient;
  }

  async listSubfoldersOfPrefix(bucketName: string, rootPrefix = ''): Promise<string[]> {
    const containerClient = AzureBlobStorageClient.getContainerClient(bucketName);

    let subfolders: string[] = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      if(blob.name.startsWith(rootPrefix)) subfolders.push(blob.name);
    }
    return subfolders;
  }

  async listItemsInBucket(bucketName: string, folderName = ''): Promise<BucketItem[]> {
    const containerClient = AzureBlobStorageClient.getContainerClient(bucketName);

    let items: BucketItem[] = [];
    for await (const blob of containerClient.listBlobsFlat({ prefix: folderName })) {
      items.push({ name: blob.name, prefix: folderName });
    }
    console.log(items)

    return items;
  }

  async getObjectUrl(bucketName: string, objectName: string) {
    const containerClient = AzureBlobStorageClient.getContainerClient(bucketName);
    const blobObject = containerClient.getBlockBlobClient(objectName);
    return blobObject.url;
  }

  async getStringFileContent(bucketName: string, objectPath: string): Promise<string> {
    const blobClient = await AzureBlobStorageClient.getContainerClient(bucketName).getBlockBlobClient(objectPath);
    const downloadBlobClientContent = await blobClient.download(0)
    downloadBlobClientContent.readableStreamBody.setEncoding('utf8');
    let data = '';
    for await (const chunk of downloadBlobClientContent.readableStreamBody) {
      data += chunk;
    }
    return data;
  }

  async setStringFileContent(bucketName: string, objectName: string, content: string): Promise<void> {
    await AzureBlobStorageClient.getContainerClient(bucketName).getBlockBlobClient(objectName).upload(content, content.length);
  }

  async setFileContent(bucketName: string, objectName: string, content: Buffer): Promise<void> {
    await AzureBlobStorageClient.getContainerClient(bucketName).getBlockBlobClient(objectName).upload(content, content.length);
  }

}
