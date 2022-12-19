export enum OCR_STATUS {
  READ = 'Read',
  STOPPED = 'Stopped',
  IN_PROGRESS = 'In Progress',
  IN_QUEUE = 'In Queue',
  DOWNLOAD_ERROR = 'Failed to download document from HCP on SURAT-INSTRUKSI',
  DOCUMENT_RECOGNITION_ERROR = 'Failed to process document on document-recognition',
  FIELD_EXTRACTOR_ERROR = 'Failed to process document on field-extractor',
  PROJECT_CREATION_ERROR = 'Failed to process document on text-extractor',
  EXPORT_PROJECT_ERROR = '“Failed to process document on export file transformer',
  POST_PROCESS_ERROR = 'Failed to process document on post processing',
  SEND_GATEWAY_ERROR = 'Failed to send document ocr result to channel',
  NO_SI_ERROR = 'Document type is not recognized by the classifier',
  TIMEOUT = 'Worker timeout on SURAT-INSTRUKSI',
  UNKNOWN_ERROR = `Unrecognized Error on SURAT-INSTRUKSI`,
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
