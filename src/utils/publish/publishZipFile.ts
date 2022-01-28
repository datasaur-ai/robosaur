import { createWriteStream, mkdirSync } from 'fs';
import { resolve } from 'path';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../object-storage';
import { normalizeFolderName } from '../object-storage/helper';
import { IMPLEMENTED_EXPORT_STORAGE_SOURCES } from './constants';
import { downloadFromPreSignedUrl } from './helper';

export async function publishZipFile(url: string, projectName: string) {
  const { source, prefix, bucketName } = getConfig().export;
  const httpResponse = downloadFromPreSignedUrl(url);

  switch (source) {
    case StorageSources.AMAZONS3:
    case StorageSources.GOOGLE:
      return await getStorageClient(source).setFileContent(
        bucketName,
        `${normalizeFolderName(prefix)}${projectName}.zip`,
        (await httpResponse).data,
      );
    case StorageSources.LOCAL:
      const dirpath = resolve(process.cwd(), prefix);
      mkdirSync(dirpath, { recursive: true });
      const filename = resolve(process.cwd(), prefix, `${projectName}.zip`);
      const writeStream = createWriteStream(filename);
      (await httpResponse).data.pipe(writeStream);
      (await httpResponse).data.on('end', () => writeStream.close());
      break;
    default:
      getLogger().error(
        `${source} is unsupported for handling project export. Please use one of ${IMPLEMENTED_EXPORT_STORAGE_SOURCES}`,
      );
      throw new Error(
        `${source} is unsupported for handling project export. Please use one of ${IMPLEMENTED_EXPORT_STORAGE_SOURCES}`,
      );
  }
}
