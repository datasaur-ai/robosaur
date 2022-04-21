import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getConfig } from '../config/config';
import { StorageSources } from '../config/interfaces';
import { getLogger } from '../logger';
import { getStorageClient } from '../utils/object-storage';

const IMPLEMENTED_SOURCES = [StorageSources.LOCAL, StorageSources.AMAZONS3, StorageSources.GOOGLE];

export async function parseAssignment(): Promise<{
  labelers: string[];
  reviewers: string[];
  useTeamMemberId?: boolean;
}> {
  const { source, bucketName, path } = getConfig()?.create?.assignment ?? { source: false, path: false };

  getLogger().info('looking for assignments in project settings');
  if (getConfig()?.create?.assignments) {
    getLogger().info('found assignments');
    return getConfig().create.assignments || { labelers: [], reviewers: [] };
  }

  if (!source) {
    return { labelers: [], reviewers: [] };
  }

  switch (source) {
    case StorageSources.LOCAL:
      return JSON.parse(readFileSync(resolve(process.cwd(), path), { encoding: 'utf-8' }));
    case StorageSources.AMAZONS3:
    case StorageSources.GOOGLE:
      return JSON.parse(await getStorageClient(source).getStringFileContent(bucketName, path));
    default:
      throw new Error(
        `${source} is not implemented for project assignment parsing. Please use one of ${JSON.stringify(
          IMPLEMENTED_SOURCES,
        )}`,
      );
  }
}
