import axios from 'axios';
import axiosRetry from 'axios-retry';
import { createReadStream, createWriteStream, existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import * as stream from 'stream';
import { promisify } from 'util';
import { Logger } from 'winston';
import { DataPayload } from '../database/entities/data';
import { DocumentQueueEntity } from '../database/entities/document_queue.entity';
import { getLogger } from '../logger';
import { getStorageClient } from '../utils/object-storage';

interface DocumentRecognitionResponseData {
  orientation_preds: number[];
  document_preds: string[];
  images_data: (string | null)[];
}

class ProjectCreationInputFilesHandler {
  private readonly data?: DataPayload;
  private readonly logger: Logger = getLogger();
  private _currentPage: number = 0;

  constructor(private readonly job: DocumentQueueEntity) {
    this.data = this.job.data;
  }

  public async handle(): Promise<void> {
    const totalPage = this.data?.file_page_size ?? 0;

    for (let page = 0; page < totalPage; page++) {
      this.logger.info(`Processing page number ${page + 1}..`);
      this.currentPage = page;
      this.createLocalDirectory();

      // Step 1: Download file
      await this.downloadFile();

      // Step 2: Document recognition API
      const recognitionResult = await this.postDocumentRecognition();

      // Step 3: Keep or remove the downloaded file
      this.cleanUp(recognitionResult);
    }
  }

  private async downloadFile(): Promise<void> {
    const bucketName = process.env.S3_BUCKET_NAME ?? '';
    const objectName = this.filePath();
    const fileUrl = await getStorageClient().getObjectUrl(bucketName, objectName);
    axiosRetry(axios, {
      retries: 5,
      retryDelay: (currentRetry) => {
        this.logger.info(`Trying to download (${currentRetry})..`);
        return 5000;
      },
      retryCondition: ({ response }) => {
        return response ? 500 <= response.status && response.status <= 599 : false;
      },
    });
    try {
      const response = await axios.get(fileUrl, { responseType: 'stream' });
      const pipeline = promisify(stream.pipeline);
      await pipeline(response.data, createWriteStream(this.localFilePath()));
    } catch (error) {
      const { response } = error;
      if (400 <= response.status && response.status <= 499) {
        this.logger.error(`Not found: ${fileUrl}`);
      }
      throw error;
    }
  }

  // Todo
  private async postDocumentRecognition(): Promise<DocumentRecognitionResponseData> {
    const apiUrl = process.env.DOCUMENT_RECOGNITION_API_URL ?? '';
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', createReadStream(this.localFilePath()));
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    try {
      const response = await axios.post<DocumentRecognitionResponseData>(apiUrl, form, {
        headers,
      });
      return response.data;
    } catch (error) {
      const { response } = error;
      if (400 <= response.status && response.status <= 499) {
        this.logger.error(`Not found: ${apiUrl}`);
      }
      throw error;
    }
  }

  // Todo
  private cleanUp(data: DocumentRecognitionResponseData): void {
    const {
      orientation_preds: orientationPredictions,
      document_preds: documentPredictions,
      images_data: imagesData,
    } = data;
    const totalPages = orientationPredictions.length;
    for (let i = 0; i < totalPages; i++) {
      if (documentPredictions[i] !== 'SURAT_INSTRUKSI') {
        this.deleteFile();
        return;
      }
      if (orientationPredictions[i] !== 0 && imagesData[i] !== null) {
        this.storeFile(imagesData[i] as string);
        return;
      }
    }
  }

  private createLocalDirectory() {
    if (!existsSync(this.localFileDirectoryPath())) {
      mkdirSync(this.localFileDirectoryPath(), { recursive: true });
    }
  }

  private storeFile(base64Content: string): void {
    writeFileSync(this.localFilePath(), Buffer.from(base64Content, 'base64'));
  }

  private deleteFile(): void {
    unlinkSync(this.localFilePath());
  }

  private localFilePath(): string {
    return `${this.localDirectoryPath()}/${this.filePath()}`;
  }

  private localFileDirectoryPath(): string {
    return `${this.localDirectoryPath()}/${this.fileDirectoryPath()}`;
  }

  private localDirectoryPath(): string {
    const projectName = this.job.id;
    return `temps/${projectName}`;
  }

  private filePath(): string {
    return `${this.fileDirectoryPath()}/${this.fileName()}`;
  }

  private fileDirectoryPath(): string {
    const imageDirectory = this.data?.parsed_image_dir ?? '';
    return imageDirectory.replace(/^\/+/, '');
  }

  private fileName(): string {
    const { id, file_type } = this.data ?? {};
    const dataId = id ?? '';
    const paddedPage = this.currentPage.toString().padStart(3, '0');
    const fileType = file_type ? `.${file_type}` : '';
    return `${dataId}_${paddedPage}${fileType}`;
  }

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(page: number) {
    this._currentPage = page;
  }
}

export async function handleProjectCreationInputFiles(job: DocumentQueueEntity): Promise<void> {
  if (job.data) {
    await new ProjectCreationInputFilesHandler(job).handle();
  }
}
