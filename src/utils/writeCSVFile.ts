import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as Papa from 'papaparse';

export function writeCSVFile(content: any[], filename: string, encoding: BufferEncoding = 'utf-8') {
  const csv = Papa.unparse(content);
  createDirIfNotExist(filename);
  return writeFileSync(filename, csv, { encoding });
}

function createDirIfNotExist(filename: string) {
  const indexFilename = filename.lastIndexOf('/');
  if (indexFilename > -1) {
    const dir = filename.slice(0, indexFilename);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}
