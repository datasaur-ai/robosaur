import { readFileSync } from 'fs';
import { resolve } from 'path';
import { StorageSources } from '../config/interfaces';
import { getStorageClient } from '../utils/object-storage';
import { getConfig } from '../config/config';
import { getBucketName, getObjectName } from '../utils/object-storage/helper';

export async function parseAssignment(): Promise<{ labelers: string[]; reviewers: string[] }> {
  const { source, path } = getConfig().assignment;

  if (!source) return { labelers: [], reviewers: [] };

  switch (source) {
    case StorageSources.LOCAL:
      return JSON.parse(readFileSync(resolve(process.cwd(), path), { encoding: 'utf-8' }));
    case StorageSources.AMAZONS3:
    case StorageSources.GOOGLE:
      return JSON.parse(await getStorageClient(source).getFileContent(getBucketName(path), getObjectName(path)));
    case StorageSources.REMOTE:
    default:
      throw new Error('Unimplemented');
  }
}
