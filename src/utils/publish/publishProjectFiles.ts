import { mkdirSync } from 'fs';
import { resolve } from 'path';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../object-storage';
import { normalizeFolderName, safeDirectoryName } from '../object-storage/helper';
import { readZipStream } from '../readZipFile';
import { IMPLEMENTED_EXPORT_STORAGE_SOURCES } from './constants';
import { downloadFromPreSignedUrl, saveFileToLocalFileSystem } from './helper';

export async function publishProjectFiles(url: string, projectName: string) {
  const zipStream = await downloadFromPreSignedUrl(url);
  const files = await readZipStream(zipStream.data);
  const { source, prefix, bucketName } = getConfig().export;
  switch (source) {
    case StorageSources.LOCAL:
      const dirname = resolve(process.cwd(), prefix, projectName);
      mkdirSync(dirname, { recursive: true });
      for (const file of files) {
        saveFileToLocalFileSystem(dirname, safeDirectoryName(file.filename), file.content);
      }
      break;
    case StorageSources.AMAZONS3:
    case StorageSources.GOOGLE:
      for (const file of files) {
        const prefixPlusProjectName = normalizeFolderName(prefix) + projectName;
        const fullObjectPath = normalizeFolderName(prefixPlusProjectName) + safeDirectoryName(file.filename);
        await getStorageClient(source).setStringFileContent(bucketName, fullObjectPath, file.content);
      }
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
