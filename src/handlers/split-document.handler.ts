import { existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { parse, unparse } from 'papaparse';
import { chunk } from 'lodash';
import { basename, join, resolve } from 'path';
import { getConfig, setConfigByJSONFile } from '../config/config';
import { getSplitDocumentValidators } from '../config/schema/validator';
import { ScriptAction } from './constants';
import { getLogger } from '../logger';
import { createSimpleHandlerContext } from '../execution';

const clearDirectory = (dirPath: string) => {
  if (!existsSync(dirPath)) {
    return;
  }
  const dir = readdirSync(dirPath, { withFileTypes: true });
  dir.forEach((file) => {
    if (file.isFile()) {
      unlinkSync(resolve(dirPath, file.name));
    } else if (file.isDirectory()) {
      clearDirectory(resolve(dirPath, file.name));
      rmdirSync(resolve(dirPath, file.name));
    }
  });
};

const prepareDirectory = (dirPath: string) => {
  if (!existsSync(dirPath)) {
    getLogger().info(`creating ${dirPath} folder`);
    mkdirSync(dirPath);
  } else {
    getLogger().warn(`${dirPath} folder is not empty, removing content`);
    clearDirectory(dirPath);
  }
};

export const handleSplitDocument = createSimpleHandlerContext('split-document', _handleSplitDocument);

export async function _handleSplitDocument(configFile: string) {
  setConfigByJSONFile(configFile, getSplitDocumentValidators(), ScriptAction.SPLIT_DOCUMENT);

  const path = getConfig().splitDocument.path;
  const linesPerFile = getConfig().splitDocument.linesPerFile;
  const filesPerFolder = getConfig().splitDocument.filesPerFolder;
  const header = getConfig().splitDocument.header;
  const resultFolder = getConfig().splitDocument.resultFolder;

  const file = readFileSync(path, 'utf-8');
  const filename = basename(path).replace('.csv', '');
  const parseResult = parse(file, { header });
  const contents = chunk(parseResult.data, linesPerFile)
    // @ts-ignore
    .map((rows) => rows.filter((row) => Object.values(row).filter((value) => !!value).length))
    .filter((rows) => rows.length > 0)
    .map((rows) => unparse(rows, parseResult.meta))
    .map((content, index) => ({ content, index }));

  prepareDirectory(resultFolder);

  chunk(contents, filesPerFolder).forEach((contentChunk, chunkIndex) => {
    prepareDirectory(join(resultFolder, `${filename}-${chunkIndex + 1}`));
    contentChunk.forEach(({ content, index }) => {
      writeFileSync(join(resultFolder, `${filename}-${chunkIndex + 1}`, `${filename}-${index + 1}.csv`), content);
    });
  });
}
