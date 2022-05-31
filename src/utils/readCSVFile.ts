import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as Papa from 'papaparse';

export const defaultCSVConfig: Papa.ParseConfig = {
  delimiter: '', // auto-detect
  newline: '' as any, // auto-detect
  quoteChar: '"',
  escapeChar: '"',
  header: false,
  transformHeader: undefined,
  dynamicTyping: false,
  preview: 0,
  comments: false,
  step: undefined,
  complete: undefined,
  skipEmptyLines: false,
  fastMode: undefined,
  beforeFirstChunk: undefined,
  transform: undefined,
  delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP],
};

export function readCSVFile(filepath: string, encoding: BufferEncoding = 'utf-8', config = defaultCSVConfig) {
  const content = readFileSync(filepath, { encoding });
  return Papa.parse(content, config);
}

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
