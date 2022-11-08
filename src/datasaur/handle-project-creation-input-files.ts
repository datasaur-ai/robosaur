import axios, { AxiosResponse } from 'axios';
import { unlinkSync, writeFileSync } from 'fs';
import { Logger } from 'winston';
import { DataPayload } from '../database/entities/data';
import { DocumentQueueEntity } from '../database/entities/document_queue.entity';
import { TEAM_SURATINSTRUKSI } from '../database/entities/teams.entity';
import { getLogger } from '../logger';

interface DownloadFileResponseData {
  content: string;
}

interface DocumentRecognitionRequestData {
  id: string;
  key: string;
  teamId: string;
  file: string;
}

interface DocumentRecognitionResponseData {
  orientation_prediction: string[];
  document_prediction: string[];
  image_data?: string[];
}

class ProjectCreationInputFilesHandler {
  private readonly data?: DataPayload;
  private readonly logger: Logger = getLogger();
  private currentPage: number = -1;

  constructor(private readonly job: DocumentQueueEntity) {
    this.data = this.job.data;
  }

  public async handle(): Promise<void> {
    const totalPage = this.data?.file_page_size ?? 0;

    for (let page = 0; page < totalPage; page++) {
      this.logger.info(`Processing page number ${page + 1}..`);
      this.setCurrentPage(page);

      // Step 1: Download file
      const downloadDocumentResponse = await this.downloadFile();
      const localFilePath = this.localFilePath();
      const fileContent = downloadDocumentResponse.data.content;
      writeFileSync(localFilePath, fileContent);

      // Step 2: Document recognition API
      const documentRecognitionResponse = await this.postDocumentRecognition(fileContent);

      // Step 3: Keep or remove the downloaded file
      if (!this.isInstructionLetterDocument(documentRecognitionResponse)) {
        unlinkSync(localFilePath);
        this.logger.error(`Document is not an instruction letter`);
        continue;
      }

      const imageContent = documentRecognitionResponse.data.image_data?.join('') ?? '';
      writeFileSync(localFilePath, imageContent);
    }
  }

  private async downloadFile(): Promise<AxiosResponse<DownloadFileResponseData>> {
    const remoteFilePath = this.remoteFilePath();
    const authToken = process.env.HCP_URL_AUTH;
    const headers = authToken ? { Authorization: authToken } : undefined;
    const response = await axios.get<DownloadFileResponseData>(remoteFilePath, { headers });
    if (response.status !== 200) {
      this.logger.error(`Download document request failed at ${remoteFilePath}`);
      throw new Error();
    }
    return response;
  }

  private async postDocumentRecognition(fileContent: string): Promise<AxiosResponse<DocumentRecognitionResponseData>> {
    const { DOCUMENT_RECOGNITION_API_URL, DOCUMENT_RECOGNITION_API_AUTH } = process.env;
    const apiUrl = DOCUMENT_RECOGNITION_API_URL ?? '';
    const apiAuth = DOCUMENT_RECOGNITION_API_AUTH ?? '';
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
    return response;
  }

  private isInstructionLetterDocument(response: AxiosResponse<DocumentRecognitionResponseData>): boolean {
    const { document_prediction: documentPredictions, image_data: imageData } = response.data;
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

  private localFilePath(): string {
    const temporaryDirectoryName = process.env.TEMPORARY_DIRECTORY;
    const projectName = this.job.id;
    return `../../${temporaryDirectoryName}/${projectName}/${this.filePath()}`;
  }

  private remoteFilePath(): string {
    const hcpUrl = process.env.HCP_URL ?? '';
    return `${hcpUrl}/${this.filePath()}`;
  }

  private filePath(): string {
    const dataId = this.data?.id ?? '';
    const paddedPage = this.currentPage.toString().padStart(3, '0');
    const imageDirectory = this.data?.parsed_image_dir ?? '';
    return `${imageDirectory}/${dataId}_${paddedPage}}`;
  }

  private setCurrentPage(currentPage: number): void {
    this.currentPage = currentPage;
  }
}

export async function handleProjectCreationInputFiles(job: DocumentQueueEntity): Promise<void> {
  if (!this.job.data) {
    return;
  }
  await new ProjectCreationInputFilesHandler(job).handle();
}
