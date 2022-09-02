import { mkdirSync } from 'fs';
import { resolve } from 'path';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../object-storage';
import { normalizeFolderName, safeDirectoryName } from '../object-storage/helper';
import { IMPLEMENTED_EXPORT_STORAGE_SOURCES } from './constants';
import { saveFileToLocalFileSystem } from './helper';

export async function publishAnnotatedDataFile(filename: string, content: string) {
  const { source, prefix, bucketName } = getConfig().exportAnnotatedData;
  switch (source) {
    case StorageSources.LOCAL:
      getLogger().info(`publishing extracted files to ${source}...`, { data: { source, prefix } });
      const dirname = resolve(process.cwd(), prefix);
      mkdirSync(dirname, { recursive: true });
      saveFileToLocalFileSystem(dirname, safeDirectoryName(filename) + '.csv', content);
      break;
    case StorageSources.AMAZONS3:
    case StorageSources.AZURE:
    case StorageSources.GOOGLE:
      getLogger().info(`publishing extracted files to ${source}...`, { data: { source, prefix, bucketName } });
      const fullObjectPath = normalizeFolderName(prefix) + safeDirectoryName(filename) + '.csv';
      await getStorageClient(source).setStringFileContent(bucketName, fullObjectPath, content);
      break;
    default:
      getLogger().error(
        `${source} is unsupported for handling project export. Please use one of ${IMPLEMENTED_EXPORT_STORAGE_SOURCES}`,
      );
      throw new Error(
        `${source} is unsupported for handling project export. Please use one of ${IMPLEMENTED_EXPORT_STORAGE_SOURCES}`,
      );
  }
  return true;
}
