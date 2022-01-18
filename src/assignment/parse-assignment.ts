import { readFileSync } from 'fs';
import { resolve } from 'path';
import { StorageSources } from '../config/interfaces';
import { getStorageClient } from '../utils/object-storage';
import { getConfig } from '../config/config';

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

function getBucketName(fullObjectPath: string) {
  const parts = fullObjectPath.split('//');
  const [bucket, ...rest] = parts[1].split('/');
  return bucket;
}

function getObjectName(fullObjectPath: string) {
  const parts = fullObjectPath.split('//');
  const [bucket, ...rest] = parts[1].split('/');
  return rest.join('/');
}
