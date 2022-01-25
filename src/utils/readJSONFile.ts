import { readFileSync } from 'fs';

export function readJSONFile(filePath: string) {
  const fileContent = readFileSync(filePath, { encoding: 'utf-8' });
  return JSON.parse(fileContent);
}
