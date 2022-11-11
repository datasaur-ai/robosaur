export enum OCR_STATUS {
  READ = 'Read',
  STOPPED = 'Stopped',
  IN_PROGRESS = 'In Progress',
  IN_QUEUE = 'In Queue',
  TIMEOUT = 'Worker timeout on DYNAMIC-OCR',
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

export const SI_TEAM_ID = 15;
