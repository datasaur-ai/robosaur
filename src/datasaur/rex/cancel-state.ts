export enum CancelState {
  UPDATE_IN_PROGRESS = 'Document id {id} stopped after update savekeeping status to In Progress',
  DOCUMENT_RECOGNITION = 'Document id {id} stopped after document-recognition process',
  PROJECT_CREATION = 'Document id {id} stopped after project creation',
  PROJECT_EXPORT = 'Document id {id} stopped after project export',
  TEXT_EXTRACTION = 'Document id {id} stopped after text-extraction process at page {page}',
  FIELD_EXTRACTION = 'Document id {id} stopped after field-extraction process',
  POST_PROCESSING = 'Document id {id} stopped after post-processing process',
}

export interface Replacer {
  id: string;
  /** required for TEXT_EXTRACTION */
  page?: string;
}

export function getCancelStateMessage(cancelState: CancelState, replacer: Replacer) {
  let message = (cancelState as unknown) as string;
  for (const [key, value] of Object.entries(replacer)) {
    message = message.replaceAll(`{${key}}`, value);
  }
  return message;
}
