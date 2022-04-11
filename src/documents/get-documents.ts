import { dirname, resolve } from 'path';
import { Document } from './interfaces';
import { getLocalDocuments } from './get-local-documents';
import { getRemoteDocuments } from './get-remote-documents';
import { getConfig, getConfigPath } from '../config/config';
import { StorageSources } from '../config/interfaces';

const IMPLEMENTED_SOURCES = [StorageSources.LOCAL, StorageSources.REMOTE];

export function getDocuments(): Document[] {
  const documents = getConfig().project.files;
  const configPath = getConfigPath();
  const configDir = dirname(configPath);

  const resolvedPath = resolve(configDir, documents.path);
  switch (documents.source) {
    case StorageSources.LOCAL:
      return getLocalDocuments(resolvedPath);
    case StorageSources.REMOTE:
      return getRemoteDocuments(resolvedPath);
    case StorageSources.AMAZONS3:
    case StorageSources.GOOGLE:
      throw new Error(`${documents.source} is supported for multiple project creation only.`);
    default:
      throw new Error(
        `${documents.source} is not implemented for this command. Please use one of ${JSON.stringify(
          IMPLEMENTED_SOURCES,
        )}`,
      );
  }
}
