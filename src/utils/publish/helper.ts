import axios, { AxiosResponse } from 'axios';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import internal from 'stream';
import { getLogger } from '../../logger';

export async function downloadFromPreSignedUrl(url: string) {
  try {
    getLogger().info(`downloading from url ${url}...`);
    const result: AxiosResponse<internal.Readable> = await axios.get(url, { responseType: 'stream' });
    return result;
  } catch (error) {
    getLogger().error(`fail in downloading from presigned URL`, {
      error: JSON.stringify(error),
      message: error.message,
      url,
    });
    throw new Error(`fail in downloading from presigned URL`);
  }
}

export function saveFileToLocalFileSystem(directory: string, filename: string, content: Buffer | string) {
  mkdirSync(directory, { recursive: true });
  writeFileSync(resolve(directory, filename), content);
}
