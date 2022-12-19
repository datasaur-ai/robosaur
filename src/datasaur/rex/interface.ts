export enum OCR_STATUS {
  READ = 'Read',
  STOPPED = 'Stopped',
  IN_PROGRESS = 'In Progress',
  IN_QUEUE = 'In Queue',
  DOWNLOAD_ERROR = 'Failed to download file on file input preparation',
  DOCUMENT_RECOGNITION_ERROR = 'Failed to process document on document-recognition',
  FIELD_EXTRACTOR_ERROR = 'Failed to process document on field-extractor',
  PROJECT_CREATION_ERROR = 'Failed to process on project creation',
  EXPORT_PROJECT_ERROR = 'Failed to process on exporting project',
  DELETE_PROJECT_ERROR = 'Failed to process on delete project',
  POST_PROCESS_ERROR = 'Failed to process document on postprocessing',
  SEND_GATEWAY_ERROR = 'Failed to send document ocr result to channel',
  NO_SI_ERROR = 'No SI document found',
  TIMEOUT = 'Worker timeout on DYNAMIC-OCR',
  UNKNOWN_ERROR = `Unrecognized Error`,
}

export enum PAYLOAD_STATUS {
  SUCCESS = 'Success',
  FAILED = 'Failed',
}

export const PAYLOAD_MESSAGE = {
  english: {
    SUCCESS: 'OCR Success',
    FAILED: 'OCR Failed',
  },
  indonesia: {
    SUCCESS: 'OCR Berhasil',
    FAILED: 'OCR Gagal',
  },
};

export enum HEALTH_STATUS {
  READY = 'READY',
  STOPPED = 'STOPPED',
  INITIAL = 'INITIALIZING',
}

export const healthPath = 'health-check.json';

export interface Health {
  status: HEALTH_STATUS;
  timestamp: Date;
}

export const SI_TEAM_ID = 15;
