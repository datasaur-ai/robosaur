import { createReadStream, readdirSync } from 'fs';
import { basename, join } from 'path';
import { LocalDocument } from './interfaces';

export function getLocalDocuments(path: string): LocalDocument[] {
  return readdirSync(path).map((filePath) => ({
    fileName: basename(filePath),
    file: createReadStream(join(path, filePath)),
  }));
}
