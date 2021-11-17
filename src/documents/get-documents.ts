import { dirname, resolve } from 'path';
import { Document } from './interfaces';
import { getLocalDocuments } from './get-local-documents';
import { getRemoteDocuments } from './get-remote-documents';
import { getConfig, getConfigPath } from '../config/config';

export function getDocuments(): Document[] {
  const documents = getConfig().documents;
  const configPath = getConfigPath();
  const configDir = dirname(configPath);
  
  const resolvedPath = resolve(configDir, documents.path);
  switch (documents.source) {
    case 'local':
      return getLocalDocuments(resolvedPath);
    case 'remote':
      return getRemoteDocuments(resolvedPath);
  }
}
