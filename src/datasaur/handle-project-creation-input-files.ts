import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { Logger } from 'winston';
import { DataPayload } from '../database/entities/data';
import { DocumentQueueEntity } from '../database/entities/document_queue.entity';
import { TEAM_SURATINSTRUKSI } from '../database/entities/teams.entity';
import { getLogger } from '../logger';
import { getStorageClient } from '../utils/object-storage';

interface DocumentRecognitionRequestData {
  id: string;
  key: string;
  teamId: string;
  file: ArrayBuffer;
}

interface DocumentRecognitionResponseData {
  orientation_prediction: string[];
  document_prediction: string[];
  image_data?: string[];
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
      const fileContent = await this.downloadFile();
      this.storeFile(fileContent);

      // Step 2: Document recognition API
      const response = await this.postDocumentRecognition(fileContent);

      // Step 3: Keep or remove the downloaded file
      if (!this.isInstructionLetterDocument(response)) {
        this.deleteFile();
        this.logger.error(`Document is not an instruction letter`);
        continue;
      }

      const imageContent = response.image_data?.join('') ?? '';
      this.storeFile(Buffer.from(imageContent));
    }
  }

  private async downloadFile(): Promise<ArrayBuffer> {
    const bucketName = process.env.S3_BUCKET_NAME ?? '';
    const objectName = this.filePath();
    const fileUrl = await getStorageClient().getObjectUrl(bucketName, objectName);
    axiosRetry(axios, {
      retries: 5,
      retryDelay: (currentRetry) => {
        this.logger.info(`Trying to download (${currentRetry})..`);
        return 5000;
      },
      retryCondition: ({ response }: AxiosError<ArrayBuffer>) => {
        return response ? 500 <= response.status && response.status <= 599 : false;
      },
    });
    const headers = { Accept: 'application/octet-stream' };
    try {
      const response = await axios.get<ArrayBuffer>(fileUrl, { headers });
      return response.data;
    } catch ({ response, message }) {
      if (400 <= response.status && response.status <= 499) {
        this.logger.error(`Not found: ${fileUrl}`);
      } else {
        this.logger.error(`Error: ${message}`);
      }
      throw new Error();
    }
  }

  private async postDocumentRecognition(fileContent: ArrayBuffer): Promise<DocumentRecognitionResponseData> {
    const apiUrl = process.env.DOCUMENT_RECOGNITION_API_URL ?? '';
    const apiAuth = process.env.DOCUMENT_RECOGNITION_API_AUTH ?? '';
    const requestData: DocumentRecognitionRequestData = {
      id: this.job.id.toString(),
      key: apiAuth,
      teamId: TEAM_SURATINSTRUKSI,
      file: fileContent,
    };
    const response = await axios.post<DocumentRecognitionResponseData>(apiUrl, requestData);
    if (response.status !== 200) {
      this.logger.error(`Document recognition request failed at ${apiUrl} ${requestData}`);
      throw new Error();
    }
    return response.data;
  }

  private isInstructionLetterDocument(data: DocumentRecognitionResponseData): boolean {
    const { document_prediction: documentPredictions, image_data: imageData } = data;
    if (!imageData) {
      return false;
    }
    for (const documentPrediction of documentPredictions) {
      if (documentPrediction !== 'SURAT_INSTRUKSI') {
        return false;
      }
    }
    return true;
  }

  private createLocalDirectory() {
    if (existsSync(this.localFileDirectoryPath())) {
      return;
    }
    mkdirSync(this.localFileDirectoryPath(), { recursive: true });
  }

  private storeFile(fileContent: ArrayBuffer): void {
    writeFileSync(this.localFilePath(), Buffer.from(fileContent));
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
  if (!job.data) {
    return;
  }
  await new ProjectCreationInputFilesHandler(job).handle();
}
