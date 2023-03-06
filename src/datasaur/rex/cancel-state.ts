export enum CancelState {
  UPDATE_IN_PROGRESS = 'Document {id} stopped after update savekeeping status to In Progress',
  DOCUMENT_RECOGNITION = 'Document {id} stopped after document-recognition process',
  PROJECT_CREATION = 'Document {id} stopped after project creation',
  PROJECT_EXPORT = 'Document {id} stopped after project export',
  TEXT_EXTRACTION = 'Document {id} stopped after text-extraction process at {page}',
  FIELD_EXTRACTION = 'Document {id} stopped after field-extraction process',
  POST_PROCESSING = 'Document {id} stopped after post-processing process',
}

export interface Replacer {
  id: string;
  /** required for TEXT_EXTRACTION */
  page?: string;
}

export function getCancelStateMessage(cancelState: CancelState, replacer: Replacer) {
  if (cancelState === CancelState.TEXT_EXTRACTION && !replacer.page) {
  }
  let message = (cancelState as unknown) as string;
  for (const [key, value] of Object.entries(replacer)) {
    message = message.replaceAll(`{${key}}`, value);
  }
  return message;
}
