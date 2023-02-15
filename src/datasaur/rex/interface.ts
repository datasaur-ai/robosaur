export enum OCR_STATUS {
  READ = 'Read',
  STOPPED = 'Stopped',
  IN_PROGRESS = 'In Progress',
  IN_QUEUE = 'In Queue',
  DOWNLOAD_ERROR = 'Failed to download document from HCP on SURAT-INSTRUKSI',
  DOCUMENT_RECOGNITION_ERROR = 'Failed to process document on document-recognition',
  FIELD_EXTRACTOR_ERROR = 'Failed to process document on field-extractor',
  PROJECT_CREATION_ERROR = 'Failed to process document on text-extractor',
  EXPORT_PROJECT_ERROR = 'Failed to process document on export file transformer',
  POST_PROCESS_ERROR = 'Failed to process document on post processing',
  SEND_GATEWAY_ERROR = 'Failed to send document ocr result to channel',
  NO_SI_ERROR = 'Document type is not recognized by the classifier',
  TIMEOUT = 'Worker timeout on SURAT-INSTRUKSI',
  UNKNOWN_ERROR = `Unknown error on SURAT-INSTRUKSI`,
}

export enum PAYLOAD_STATUS {
  SUCCESS = 'Success',
  FAILED = 'Failed',
}

export const PAYLOAD_MESSAGE = {
  english: {
    [OCR_STATUS.READ]: 'OCR Success',
    [OCR_STATUS.STOPPED]: 'OCR Stopped',
    [OCR_STATUS.DOWNLOAD_ERROR]: 'Failed to download images from HCP',
    [OCR_STATUS.DOCUMENT_RECOGNITION_ERROR]: 'Document Detection Failed',
    [OCR_STATUS.FIELD_EXTRACTOR_ERROR]: 'Field Extractor Failed to Detect Targeted Field Value',
    [OCR_STATUS.PROJECT_CREATION_ERROR]: 'Text Extractor Failed to Read Text',
    [OCR_STATUS.EXPORT_PROJECT_ERROR]: 'File Transformer Failed to Export',
    [OCR_STATUS.POST_PROCESS_ERROR]: 'Post Processing Failed to process File Transformer values',
    [OCR_STATUS.NO_SI_ERROR]: 'Document type is not recognized by classifier ',
    [OCR_STATUS.TIMEOUT]: 'Worker timeout on SURAT-INSTRUKSI',
    [OCR_STATUS.UNKNOWN_ERROR]: 'Unknown error on SURAT-INSTRUKSI',
  },
  indonesia: {
    [OCR_STATUS.READ]: 'OCR Berhasil',
    [OCR_STATUS.STOPPED]: 'OCR Berhenti',
    [OCR_STATUS.DOWNLOAD_ERROR]: 'Gagal mengunduh gambar dari HCP    ',
    [OCR_STATUS.DOCUMENT_RECOGNITION_ERROR]: 'Deteksi Dokumen Gagal',
    [OCR_STATUS.FIELD_EXTRACTOR_ERROR]: 'Field Extractor Gagal Mendeteksi Field yang Dicari',
    [OCR_STATUS.PROJECT_CREATION_ERROR]: 'Text Extractor Gagal Membaca Teks',
    [OCR_STATUS.EXPORT_PROJECT_ERROR]: 'File Transformer Gagal Melakukan Ekspor',
    [OCR_STATUS.POST_PROCESS_ERROR]: 'Post Processing Gagal memproses File Transformer values',
    [OCR_STATUS.NO_SI_ERROR]: 'Tipe dokumen tidak diketahui oleh classifier',
    [OCR_STATUS.TIMEOUT]: 'Worker timeout pada SURAT-INSTRUKSI',
    [OCR_STATUS.UNKNOWN_ERROR]: 'Error tidak dikenal pada SURAT-INSTRUKSI',
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
