import { getConfig } from '../config/config';
import { Config, SplitDocumentStrategy } from '../config/interfaces';
import { Document } from '../documents/interfaces';
import { getLogger } from '../logger';

export function getDocumentsWithPart(documents: Document[]) {
  const splitDocumentOption = getConfig()?.create?.splitDocumentOption;

  const documentsWithPartInformation = documents.map((document) => ({
    fileName: document.fileName,
    part: 0,
  }));

  if (isSplitDocumentOptionValid(splitDocumentOption)) {
    getLogger().info('SplitDocumentOption detected, assigning split files...', { splitDocumentOption });
    const numberOfParts = splitDocumentOption?.number as number;
    for (let index = 1; index < numberOfParts; index++) {
      for (const document of documents) {
        documentsWithPartInformation.push({ fileName: document.fileName, part: index });
      }
    }
  } else {
    getLogger().info('invalid / no SplitDocumentOption detected, assigning document as-is', { splitDocumentOption });
  }

  documentsWithPartInformation.sort((doc1, doc2) => {
    const stringComparisonResult = doc1.fileName.localeCompare(doc2.fileName);
    if (stringComparisonResult === 0) {
      return doc1.part - doc2.part;
    }
    return stringComparisonResult;
  });

  return documentsWithPartInformation;
}

function isSplitDocumentOptionValid(splitDocumentOption: Config['create']['splitDocumentOption'] | undefined) {
  return (
    Boolean(splitDocumentOption) &&
    splitDocumentOption?.strategy === SplitDocumentStrategy.BY_PARTS &&
    splitDocumentOption?.number > 1
  );
}
