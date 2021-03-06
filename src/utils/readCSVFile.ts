import { readFileSync } from 'fs';
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
