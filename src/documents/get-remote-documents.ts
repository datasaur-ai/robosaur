import { readJSONFile } from '../utils/readJSONFile';
import { RemoteDocument } from './interfaces';

export function getRemoteDocuments(filePath: string): RemoteDocument[] {
  return readJSONFile(filePath);
}
