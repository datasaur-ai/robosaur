import { readdirSync } from 'fs';
import { DocumentsConfig, StorageSources } from '../../../config/interfaces';
import { KontextConfigNotFoundError } from '../errors/kontextConfigNotFoundError';
import { WrongZipRootFolderStructure } from '../errors/wrongZipRootFolderStructure';

const validateFolderStructure = (zipRootPath: string) => {
  const dir = readdirSync(zipRootPath, { withFileTypes: true });
  dir.forEach((content) => {
    if (!content.isDirectory()) {
      throw new WrongZipRootFolderStructure();
    }
  });
};

export const validateKontext = (documentConfig: DocumentsConfig) => {
  if (!documentConfig?.kontext) {
    throw new KontextConfigNotFoundError();
  }

  if (documentConfig.source !== StorageSources.LOCAL) {
    throw new Error('only local source is supported for document.source when using --from-zip option');
  }

  validateFolderStructure(documentConfig.kontext.zipRootPath);
};
