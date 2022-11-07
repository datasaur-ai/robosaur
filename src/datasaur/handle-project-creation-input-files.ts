import axios from 'axios';
import { unlinkSync, writeFileSync } from 'fs';
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

export async function handleProjectCreationInputFiles(job: DocumentQueueEntity): Promise<void> {
  if (!job.data) {
    return;
  }

  const {
    HCP_URL,
    HCP_URL_AUTH,
    DOCUMENT_RECOGNITION_API_URL,
    DOCUMENT_RECOGNITION_API_AUTH,
    TEMPORARY_DIRECTORY,
  } = process.env;

  const hcpUrl = HCP_URL ?? '';
  const hcpUrlAuth = HCP_URL_AUTH ?? '';
  const documentRecognitionApiUrl = DOCUMENT_RECOGNITION_API_URL ?? '';
  const documentRecognitionApiAuth = DOCUMENT_RECOGNITION_API_AUTH ?? '';
  const projectStoragePath = `../../${TEMPORARY_DIRECTORY}/${job.id}`;

  const { id: dataId, parsed_image_dir: imageDirectory, file_page_size: totalPageNumber } = job.data;
  const logger = getLogger();

  for (let pageNumber = 0; pageNumber < totalPageNumber; pageNumber++) {
    logger.info(`Processing page number ${pageNumber + 1}..`);

    // Step 1: Download file
    const fileName = `${dataId}_${pageNumber.toString().padStart(3, '0')}`;
    const fileSubPath = `${imageDirectory}/${fileName}`;

    const remoteFileUrl = `${hcpUrl}/${fileSubPath}`;
    const requestHeaders = hcpUrlAuth ? { Authorization: hcpUrlAuth } : undefined;
    const downloadFileResponse = await axios.get<DownloadFileResponseData>(remoteFileUrl, { headers: requestHeaders });
    if (downloadFileResponse.status !== 200) {
      logger.error(`Download document request failed at ${remoteFileUrl}`);
      throw new Error();
    }

    const localFilePath = `${projectStoragePath}/${fileSubPath}`;
    const fileContent = downloadFileResponse.data.content;
    writeFileSync(localFilePath, fileContent);

    // Step 2: Document recognition API
    const documentRecognitionRequestData: DocumentRecognitionRequestData = {
      id: job.id.toString(),
      key: documentRecognitionApiAuth,
      teamId: TEAM_SURATINSTRUKSI,
      file: fileContent,
    };
    const documentRecognitionResponse = await axios.post<DocumentRecognitionResponseData>(
      documentRecognitionApiUrl,
      documentRecognitionRequestData,
    );
    if (documentRecognitionResponse.status !== 200) {
      logger.error(
        `Document recognition request failed at ${documentRecognitionApiUrl} ${documentRecognitionRequestData}`,
      );
      throw new Error();
    }

    // Step 3: Keep or remove the downloaded file
    const { document_prediction: documentPredictions, image_data: imageData } = documentRecognitionResponse.data;

    if (!imageData) {
      unlinkSync(localFilePath);
      logger.error(`Document is not an instruction letter`);
      throw new Error();
    }

    for (const documentPrediction of documentPredictions) {
      if (documentPrediction !== 'SURAT_INSTRUKSI') {
        unlinkSync(localFilePath);
        logger.error(`Document is not an instruction letter`);
        throw new Error();
      }
    }

    // Replace the existing file with image_data
    writeFileSync(localFilePath, imageData.join(''));
  }
}
