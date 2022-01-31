import { createWriteStream, mkdirSync } from 'fs';
import { resolve as resolvePath } from 'path';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../object-storage';
import { normalizeFolderName, safeDirectoryName } from '../object-storage/helper';
import { IMPLEMENTED_EXPORT_STORAGE_SOURCES } from './constants';
import { downloadFromPreSignedUrl } from './helper';

export async function publishZipFile(url: string, projectName: string) {
  const { source, prefix, bucketName } = getConfig().export;
  const httpResponse = await downloadFromPreSignedUrl(url);

  switch (source) {
    case StorageSources.AMAZONS3:
    case StorageSources.GOOGLE:
      return await getStorageClient(source).setFileContent(
        bucketName,
        safeDirectoryName(`${normalizeFolderName(prefix)}${projectName}.zip`),
        httpResponse.data,
      );
    case StorageSources.LOCAL:
      const dirpath = resolvePath(process.cwd(), prefix);
      mkdirSync(dirpath, { recursive: true });
      const filename = safeDirectoryName(resolvePath(process.cwd(), prefix, `${projectName}.zip`));
      const writeStream = createWriteStream(filename);
      httpResponse.data.pipe(writeStream);
      return new Promise<void>((res, rej) => {
        httpResponse.data.on('end', () => {
          writeStream.close();
          res();
        });
        httpResponse.data.on('error', (err) => {
          getLogger().error(`error when piping stream to local file`, { error: { message: err.message } });
          rej(err);
        });
      });
    default:
      getLogger().error(
        `${source} is unsupported for handling project export. Please use one of ${IMPLEMENTED_EXPORT_STORAGE_SOURCES}`,
      );
      throw new Error(
        `${source} is unsupported for handling project export. Please use one of ${IMPLEMENTED_EXPORT_STORAGE_SOURCES}`,
      );
  }
}
