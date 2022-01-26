import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getConfig } from '../config/config';
import { StorageSources } from '../config/interfaces';
import { getStorageClient } from '../utils/object-storage';

const IMPLEMENTED_SOURCES = [StorageSources.LOCAL, StorageSources.AMAZONS3, StorageSources.GOOGLE];

export async function parseAssignment(): Promise<{ labelers: string[]; reviewers: string[] }> {
  const { source, bucketName, path } = getConfig()?.assignment ?? { source: false, path: false };

  if (!source) return { labelers: [], reviewers: [] };

  switch (source) {
    case StorageSources.LOCAL:
      return JSON.parse(readFileSync(resolve(process.cwd(), path), { encoding: 'utf-8' }));
    case StorageSources.AMAZONS3:
    case StorageSources.GOOGLE:
      return JSON.parse(await getStorageClient(source).getFileContent(bucketName, path));
    default:
      throw new Error(
        `${source} is not implemented for project assignment parsing. Please use one of ${JSON.stringify(
          IMPLEMENTED_SOURCES,
        )}`,
      );
  }
}
