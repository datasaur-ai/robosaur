import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../object-storage';
import { normalizeFolderName } from '../object-storage/helper';
import { readZipStream } from '../readZipFile';
import { downloadFromPreSignedUrl, IMPLEMENTED_EXPORT_STORAGE_SOURCES } from './publishZipFile';

export async function publishFiles(url: string, projectName: string) {
  const zipStream = await downloadFromPreSignedUrl(url);
  const files = await readZipStream(zipStream.data);
  const { source, prefix, bucketName } = getConfig().export;
  switch (source) {
    case StorageSources.LOCAL:
      const dirname = resolve(process.cwd(), prefix, projectName);
      mkdirSync(dirname, { recursive: true });
      for (const file of files) {
        writeFileSync(resolve(dirname, file.filename), file.content);
      }
      break;
    case StorageSources.AMAZONS3:
    case StorageSources.GOOGLE:
      for (const file of files) {
        const prefixPlusProjectName = normalizeFolderName(prefix) + projectName;
        const fullObjectPath = normalizeFolderName(prefixPlusProjectName) + file.filename;
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
      break;
  }
}
