import { Document } from '../documents/interfaces';
import { assignAllDocuments } from './assign-all-documents';
import * as ConfigModule from '../config/config';
import { AssignmentConfig, DocumentAssignment } from './interfaces';
import { Config, SplitDocumentStrategy } from '../config/interfaces';

describe(assignAllDocuments.name, () => {
  let assignment: AssignmentConfig;
  let documents: Document[];

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('no split strategy', () => {
    beforeAll(() => {
      assignment = {
        labelers: ['l-one@email.com', 'l-two@email.com', 'l-three@email.com'],
        reviewers: ['r-one@email.com', 'r-two@email.com'],
      };

      documents = [
        { fileName: 'dummy-1' },
        { fileName: 'dummy-2' },
        { fileName: 'dummy-3' },
        { fileName: 'dummy-4' },
        { fileName: 'dummy-4' },
      ] as Document[];
    });

    it('all team members should have the same number of documents assigned', () => {
      jest
        .spyOn(ConfigModule, 'getConfig')
        .mockName('mockGetConfig')
        .mockImplementation(() => {
          return {
            create: {
              assignment: {
                strategy: 'ALL',
              },
              projectSettings: {
                consensus: 1,
              },
            },
          } as Config;
        });
      const actual = assignAllDocuments(assignment, documents);
      expect(checkActualHaveSameDocumentLength(actual)).toEqual(true);
    });
  });

  describe('BY_PARTS split strategy', () => {
    beforeAll(() => {
      assignment = {
        labelers: ['l-one@email.com', 'l-two@email.com', 'l-three@email.com'],
        reviewers: ['r-one@email.com', 'r-two@email.com'],
      };

      documents = [{ fileName: 'dummy-1' }, { fileName: 'dummy-2' }] as Document[];
    });
    it('all team members should have the same number of documents assigned', () => {
      const splitDocumentOption = {
        number: 5,
        strategy: SplitDocumentStrategy.BY_PARTS,
      };
      jest
        .spyOn(ConfigModule, 'getConfig')
        .mockName('mockGetConfig')
        .mockImplementation(() => {
          return {
            create: {
              assignment: {
                strategy: 'ALL',
              },
              splitDocumentOption: splitDocumentOption,
              projectSettings: {
                consensus: 1,
              },
            },
          } as Config;
        });

      const actual = assignAllDocuments(assignment, documents);
      expect(checkActualHaveSameDocumentLength(actual)).toEqual(true);
    });
  });
});

function checkActualHaveSameDocumentLength(documentAssignments: DocumentAssignment[]) {
  let length: number | undefined = undefined;
  for (const documentAssignment of documentAssignments) {
    if (documentAssignment.documents) {
      if (length) {
        if (length != documentAssignment.documents.length) {
          return false;
        }
      } else {
        length = documentAssignment.documents.length;
      }
    } else {
      console.error('documents was null / undefined');
    }
  }
  return true;
}
