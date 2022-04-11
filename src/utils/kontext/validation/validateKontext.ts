import { readdirSync } from 'fs';
import { DocumentsConfig } from '../../../config/interfaces';
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

  validateFolderStructure(documentConfig.kontext.zipRootPath);
};
