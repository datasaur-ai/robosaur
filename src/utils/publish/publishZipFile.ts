import { createWriteStream, mkdirSync, writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../object-storage';
import { normalizeFolderName, safeDirectoryName } from '../object-storage/helper';
import { streamToBuffer } from '../stream/streamToBuffer';
import { IMPLEMENTED_EXPORT_STORAGE_SOURCES } from './constants';
import { downloadFromPreSignedUrl } from './helper';

export async function publishZipFile(url: string, projectName: string) {
  const { source, prefix, bucketName } = getConfig().export;
  const httpResponse = await downloadFromPreSignedUrl(url);
  const httpResponseData = await streamToBuffer(httpResponse.data);

  switch (source) {
    case StorageSources.AMAZONS3:
    case StorageSources.GOOGLE:
      return await getStorageClient(source).setFileContent(
        bucketName,
        `${normalizeFolderName(prefix)}${safeDirectoryName(projectName)}.zip`,
        httpResponseData,
      );
    case StorageSources.LOCAL:
      const dirpath = resolvePath(process.cwd(), prefix);
      mkdirSync(dirpath, { recursive: true });
      const filename = resolvePath(process.cwd(), prefix, `${safeDirectoryName(projectName)}.zip`);
      writeFileSync(filename, httpResponseData);
    default:
      getLogger().error(
        `${source} is unsupported for handling project export. Please use one of ${IMPLEMENTED_EXPORT_STORAGE_SOURCES}`,
      );
      throw new Error(
        `${source} is unsupported for handling project export. Please use one of ${IMPLEMENTED_EXPORT_STORAGE_SOURCES}`,
      );
  }
}
