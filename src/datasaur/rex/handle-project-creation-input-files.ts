import { S3 } from 'aws-sdk';
import axios, { AxiosResponse } from 'axios';
import { createReadStream, createWriteStream, existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import * as https from 'https';
import * as stream from 'stream';
import { promisify } from 'util';
import { Logger } from 'winston';
import { BasePayload } from '../../database/entities/base-payload.entity';
import { getLogger } from '../../logger';
import { AwsS3StorageClient, EXPIRED_IN_SECONDS } from '../../utils/object-storage/aws-s3-storage';
import { checkRecordStatus } from './check-record-status';
import { DownloadFileError } from './errors/download-file-error';
import { NoSIError } from './errors/no-si-error';
import { RecognizeDocumentError } from './errors/recognize-document-error';

interface DocumentRecognitionResponseData {
  orientation_preds: number[];
  document_preds: string[];
  images_data: (string | null)[];
  status: string;
}

class ProjectCreationInputFilesHandler {
  private readonly logger: Logger = getLogger();
  private currentPage: number = 0;
  private SICount: number = 0;

  constructor(private readonly data: BasePayload) {}

  public async handle(): Promise<void> {
    for (this.currentPage = 0; this.currentPage < this.totalDocumentPage(); this.currentPage++) {
      const OBJECT_STORAGE_CLIENT = process.env.OBJECT_STORAGE_CLIENT ?? 'S3';
      this.logger.info(`Processing document page ${this.currentPage + 1}..`);
      this.createLocalDirectory();

      // Step 1: Download document
      if (OBJECT_STORAGE_CLIENT === 'S3') {
        await this.downloadFileFromS3();
      } else if (OBJECT_STORAGE_CLIENT === 'HCP') {
        await this.downloadFileFromHCP();
      }

      await checkRecordStatus(this.getSaveKeepingId());

      // Step 2: Document recognition API
      const recognitionResult = await this.recognizeDocument();

      // Step 3: Keep or remove the downloaded file
      this.filterDocumentFile(recognitionResult);
    }

    if (this.SICount === 0) {
      throw new NoSIError();
    }
  }

  private totalDocumentPage(): number {
    const { page_count } = this.data;
    return page_count ? Number(page_count) : 1;
  }

  private async downloadFileFromHCP(): Promise<void> {
    const HCP_AUTH = process.env.HCP_AUTH_KEY ?? '';
    const HCP_ENDPOINT = process.env.HCP_ENDPOINT ?? '';
    const fileUrl = `${HCP_ENDPOINT}/${this.remoteFilePath()}`;
    const headers = {
      Authorization: HCP_AUTH,
    };

    let currentRetry = 0;
    const maxRetries = 5;
    const retryDelay = 5;

    do {
      try {
        this.logger.info(`Downloading document from HCP..`);
        const pemPath = process.env.HCP_PEM_PATH;
        let response: AxiosResponse;
        if (pemPath) {
          const request = axios.create({
            httpsAgent: new https.Agent({
              key: pemPath,
            }),
            headers,
            responseType: 'stream',
          });
          response = await request.get(fileUrl);
        } else {
          const request = axios.create({
            httpsAgent: new https.Agent({
              rejectUnauthorized: false,
            }),
            headers,
            responseType: 'stream',
          });
          response = await request.get(fileUrl);
        }
        const pipeline = promisify(stream.pipeline);
        await pipeline(response.data, createWriteStream(this.localFilePath()));
        break;
      } catch (error) {
        if (error.response) {
          const { response } = error;
          const { status } = response;
          this.handleAxiosResponse(fileUrl, response);
          if (400 <= status && status <= 499) {
            throw new DownloadFileError(error);
          }
        } else {
          this.logger.error(`Not an axios response ${JSON.stringify(error)}`);
        }
      }
      currentRetry++;
      await new Promise((f) => setTimeout(f, retryDelay * 1000));
      this.logger.warn(`Retrying (${currentRetry})..`);
    } while (currentRetry <= maxRetries);
  }

  private async downloadFileFromS3(): Promise<void> {
    const bucketName = process.env.S3_BUCKET_NAME ?? '';
    const objectName = this.remoteFilePath();
    const fileUrl = await this.getObjectUrl(bucketName, objectName);
    let currentRetry = 0;
    const maxRetries = 5;
    const retryDelay = 5;
    do {
      try {
        this.logger.info(`Downloading document from S3..`);
        const response = await axios.get(fileUrl, { responseType: 'stream' });
        const pipeline = promisify(stream.pipeline);
        await pipeline(response.data, createWriteStream(this.localFilePath()));
        break;
      } catch (error) {
        if (error.response) {
          const { response } = error;
          const { status } = response;
          this.handleAxiosResponse(fileUrl, response);
          if (400 <= status && status <= 499) {
            throw new DownloadFileError(error);
          }
        } else {
          this.logger.error(`Not an axios response ${JSON.stringify(error)}`);
        }
      }
      currentRetry++;
      await new Promise((f) => setTimeout(f, retryDelay * 1000));
      this.logger.warn(`Retrying (${currentRetry})..`);
    } while (currentRetry <= maxRetries);
  }

  private async recognizeDocument(): Promise<DocumentRecognitionResponseData> {
    const apiUrl = process.env.DOCUMENT_RECOGNIZER_ENDPOINT ?? '';
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', createReadStream(this.localFilePath()));
    try {
      this.logger.info(`Recognizing document..`);
      const response = await axios.post<DocumentRecognitionResponseData>(apiUrl, form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        this.handleAxiosResponse(apiUrl, error.response);
      } else {
        this.logger.error(`Not an axios response ${JSON.stringify(error)}`);
      }
      throw new RecognizeDocumentError(error);
    }
  }

  private handleAxiosResponse<T>(url: string, response: AxiosResponse<T>) {
    const { status } = response;
    if (status === 404) {
      this.logger.error(`Not found: ${url}`);
    } else if (400 <= status && status <= 499) {
      this.logger.error(`Bad request: ${url}`);
    } else if (500 <= status && status <= 599) {
      this.logger.error(`Server error: ${url}`);
    }
  }

  private filterDocumentFile(data: DocumentRecognitionResponseData): void {
    const {
      orientation_preds: orientationPredictions,
      document_preds: documentPredictions,
      images_data: imagesData,
    } = data;
    const totalPages = orientationPredictions.length;
    for (let i = 0; i < totalPages; i++) {
      if (documentPredictions[i] !== 'SURAT_INSTRUKSI') {
        this.deleteFile();
        this.logger.info('The document is not instruction letter. Downloaded file has been deleted.');
        return;
      } else {
        this.SICount += 1;
      }
      if (orientationPredictions[i] !== 0 && imagesData[i] !== null) {
        this.storeFile(imagesData[i] as string);
        this.logger.info('The document is instruction letter and orientation is wrong. Corrected file has been kept.');
        return;
      }
    }
    this.logger.info('No action is taken.');
  }

  private async getObjectUrl(bucketName: string, objectName: string): Promise<string> {
    // bypass the getStorageClient method because we are not reading s3 config from config file. We read the s3 from env var
    return AwsS3StorageClient.getClient(this.getS3Config()).getSignedUrlPromise('getObject', {
      Bucket: bucketName,
      Key: objectName,
      Expires: EXPIRED_IN_SECONDS,
    });
  }

  private getS3Config(): S3.Types.ClientConfiguration {
    return {
      endpoint: process.env.S3_ENDPOINT ?? '',
      accessKeyId: process.env.S3_ACCESS_KEY ?? '',
      secretAccessKey: process.env.S3_SECRET_KEY ?? '',
      region: process.env.S3_REGION,
    };
  }

  private getSaveKeepingId() {
    return this.data._id;
  }

  private createLocalDirectory() {
    if (!existsSync(this.localDirectoryPath())) {
      mkdirSync(this.localDirectoryPath(), { recursive: true });
    }
  }

  private storeFile(base64Content: string): void {
    writeFileSync(this.localFilePath(), Buffer.from(base64Content, 'base64'));
  }

  private deleteFile(): void {
    unlinkSync(this.localFilePath());
  }

  private localFilePath(): string {
    return `${this.localDirectoryPath()}/${this.fileName()}`;
  }

  private localDirectoryPath(): string {
    const projectName = this.getSaveKeepingId();
    return `temps/${projectName}`;
  }

  private remoteFilePath(): string {
    const directoryPath = this.remoteDirectoryPath();
    return `${directoryPath}${directoryPath ? '/' : ''}${this.fileName()}`;
  }

  private remoteDirectoryPath(): string {
    const imageDirectory = this.data?.parsed_image_dir ?? '';
    return imageDirectory.replace(/^\/+/, '');
  }

  private fileName(): string {
    const { _id: dataId, document_extension } = this.data;
    const paddedPage = this.currentPage.toString().padStart(3, '0');
    const documentExtension = document_extension ? `${document_extension}` : '';
    return `${dataId}_${paddedPage}${documentExtension}`;
  }
}

export async function handleProjectCreationInputFiles(data: BasePayload): Promise<void> {
  await new ProjectCreationInputFilesHandler(data).handle();
}
