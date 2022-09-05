import { existsSync } from 'fs';
import { appendFile, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { getLogger } from '../logger';

async function readInputDir(path: string) {
  return readdir(path);
}

export async function handleCombineCsv(inputPath: string, outputPath: string, opts: { headers: boolean }) {
  const { headers } = opts;
  console.log(headers);
  if (!existsSync(inputPath)) throw new Error('invalid input path');
  const fileNames = await readInputDir(inputPath);
  let headerLine = '';
  let headerAlreadyWritten = false;
  getLogger().info(`got ${fileNames.length} files from ${inputPath}`);

  for (const file of fileNames) {
    const filePath = join(inputPath, file);
    const fileContent = await readFile(filePath, { encoding: 'utf8' });
    let result: string;
    if (headers) {
      // get headers
      const lines = fileContent.split('\n');
      const [currentHeaders, ...content] = lines;
      headerLine = currentHeaders;
      result = content.join('\n');
      if (!headerAlreadyWritten) {
        await appendFile(outputPath, headerLine + '\n', { encoding: 'utf8' });
        headerAlreadyWritten = true;
      }
    } else {
      result = fileContent;
    }
    await appendFile(outputPath, result + '\n', { encoding: 'utf8' });
    getLogger().info(`success append ${filePath}`);
  }
}
