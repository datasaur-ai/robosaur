import { ReadStream } from 'fs';

export type Document = LocalDocument | RemoteDocument;

export interface LocalDocument {
  fileName: string;
  file: ReadStream;
}

export interface RemoteDocument {
  fileName: string;
  externalImportableUrl: string;
}
