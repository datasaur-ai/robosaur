import * as ConfigModule from '../config/config';
import { Config, SplitDocumentStrategy } from '../config/interfaces';
import { Document } from '../documents/interfaces';
import { getDocumentsWithPart } from './get-documents-with-part';

describe(getDocumentsWithPart.name, () => {
  let documents: Document[];
  beforeAll(() => {
    documents = [{ fileName: 'dummy-1' }, { fileName: 'dummy-2' }] as Document[];
  });

  describe(`${SplitDocumentStrategy.BY_PARTS}`, () => {
    it('should split documents with 0 ... n-1 part', () => {
      const N_PARTS = 5;
      jest.spyOn(ConfigModule, 'getConfig').mockImplementation(() => {
        return {
          create: {
            splitDocumentOption: {
              strategy: SplitDocumentStrategy.BY_PARTS,
              number: N_PARTS,
            },
          },
        } as Config;
      });

      const actual = getDocumentsWithPart(documents);
      expect(actual.length).toEqual(documents.length * N_PARTS);
      expect(checkDocumentWithParts(actual, N_PARTS)).toBeTruthy();
    });
  });
});

function checkDocumentWithParts(documentsWithPart: Array<{ part: number; fileName: string }>, N_PARTS: number) {
  for (const document of documentsWithPart) {
    if (document.part > N_PARTS) return false;
  }
  return true;
}
