import axios, { AxiosResponse } from 'axios';
import { createReadStream, createWriteStream, existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import * as minio from 'minio';
import * as stream from 'stream';
import { promisify } from 'util';
import { Logger } from 'winston';
import { Team15 } from '../database/entities/teamPayloads/team_15.entity';
import { getLogger } from '../logger';

interface DocumentRecognitionResponseData {
  orientation_preds: number[];
  document_preds: string[];
  images_data: (string | null)[];
  status: string;
}

class ProjectCreationInputFilesHandler {
  private readonly logger: Logger = getLogger();
  private currentPage: number = 0;

  constructor(private readonly data: Team15) {}

  public async handle(): Promise<void> {
    for (let page = 1; page <= this.totalDocumentPage(); page++) {
      this.logger.info(`Processing document page ${page}..`);
      this.currentPage = page;
      this.createLocalDirectory();

      // Step 1: Download document
      await this.downloadFile();

      // Step 2: Document recognition API
      const recognitionResult = await this.recognizeDocument();

      // Step 3: Keep or remove the downloaded file
      this.filterDocumentFile(recognitionResult);
    }
  }

  private totalDocumentPage(): number {
    const { page_count } = this.data;
    return page_count ? Number(page_count) : 1;
  }

  private async downloadFile(): Promise<void> {
    const bucketName = process.env.S3_BUCKET_NAME ?? '';
    const objectName = this.remoteFilePath();
    const fileUrl = await this.getObjectUrl(bucketName, objectName);
    let currentRetry = 0;
    const maxRetries = 5;
    const retryDelay = 5;
    do {
      try {
        this.logger.info(`Downloading document..`);
        const response = await axios.get(fileUrl, { responseType: 'stream' });
        const pipeline = promisify(stream.pipeline);
        await pipeline(response.data, createWriteStream(this.localFilePath()));
        break;
      } catch (error) {
        const { response } = error;
        const { status } = response;
        this.handleAxiosError(fileUrl, response);
        if (400 <= status && status <= 499) {
          throw error;
        }
      }
      currentRetry++;
      await new Promise((f) => setTimeout(f, retryDelay * 1000));
      this.logger.warn(`Retrying (${currentRetry})..`);
    } while (currentRetry <= maxRetries);
  }

  private async recognizeDocument(): Promise<DocumentRecognitionResponseData> {
    const apiUrl = process.env.DOCUMENT_RECOGNITION_ENDPOINT ?? '';
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', createReadStream(this.localFilePath()));
    try {
      this.logger.info(`Processing document..`);
      const response = await axios.post<DocumentRecognitionResponseData>(apiUrl, form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleAxiosError(apiUrl, error.response);
      throw error;
    }
  }

  private handleAxiosError<T>(url: string, response: AxiosResponse<T>) {
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
      }
      if (orientationPredictions[i] !== 0 && imagesData[i] !== null) {
        this.storeFile(imagesData[i] as string);
        this.logger.info('The document is instruction letter. New file has been kept.');
        return;
      }
    }
    this.logger.info('No action is taken.');
  }

  private async getObjectUrl(bucketName: string, objectName: string): Promise<string> {
    return new minio.Client(this.getMinioConfig()).presignedUrl('get', bucketName, objectName);
  }

  private getMinioConfig(): minio.ClientOptions {
    return {
      endPoint: process.env.S3_ENDPOINT ?? '',
      accessKey: process.env.S3_ACCESS_KEY ?? '',
      secretKey: process.env.S3_SECRET_KEY ?? '',
      region: process.env.S3_REGION,
    };
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
    const projectName = this.data.id;
    return `temps/${projectName}`;
  }

  private remoteFilePath(): string {
    return `${this.remoteDirectoryPath()}/${this.fileName()}`;
  }

  private remoteDirectoryPath(): string {
    const imageDirectory = this.data?.parsed_image_dir ?? '';
    return imageDirectory.replace(/^\/+/, '');
  }

  private fileName(): string {
    const dataId = this.data.id;
    const paddedPage = this.currentPage.toString().padStart(3, '0');
    return `${dataId}_${paddedPage}`;
  }
}

export async function handleProjectCreationInputFiles(data: Team15): Promise<void> {
  await new ProjectCreationInputFilesHandler(data).handle();
}
