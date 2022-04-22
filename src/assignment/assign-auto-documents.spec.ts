import * as ConfigModule from '../config/config';
import { Config, SplitDocumentStrategy } from '../config/interfaces';
import { Document } from '../documents/interfaces';
import { assignAutoDocuments } from './assign-auto-documents';
import { AssignmentConfig, DocumentAssignment } from './interfaces';

describe(assignAutoDocuments.name, () => {
  let assignment: AssignmentConfig;
  let documents: Document[];

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('5 files, 3 labeler, no split', () => {
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

    it('should assign each document to `consensus` number of labeler', () => {
      const consensusNumber = 2;
      jest
        .spyOn(ConfigModule, 'getConfig')
        .mockName('mockGetConfig')
        .mockImplementation(() => {
          return {
            create: {
              assignment: {
                strategy: 'AUTO',
              },
              projectSettings: {
                consensus: consensusNumber,
              },
            },
          } as Config;
        });

      const documentAssignments = assignAutoDocuments(assignment, documents);
      expect(checkConsensusReachable(documentAssignments, consensusNumber)).toEqual(true);
    });
  });

  describe(`2 files, 3 labelers, consensus is 1, no split`, () => {
    beforeAll(() => {
      assignment = {
        labelers: ['l-one@email.com', 'l-two@email.com', 'l-three@email.com'],
        reviewers: ['r-one@email.com', 'r-two@email.com'],
      };

      documents = [{ fileName: 'dummy-1' }, { fileName: 'dummy-2' }] as Document[];
    });

    it('should give all three labeler at least 1 document', () => {
      jest
        .spyOn(ConfigModule, 'getConfig')
        .mockName('mockGetConfig')
        .mockImplementation(() => {
          return {
            create: {
              assignment: {
                strategy: 'AUTO',
              },
              projectSettings: {
                consensus: 1,
              },
            },
          } as Config;
        });
      const documentAssignments = assignAutoDocuments(assignment, documents);
      expect(checkAllLabelerHaveDocuments(documentAssignments, assignment.labelers)).toEqual(true);
    });
  });

  describe(`1 file, 5 split, 10 labeler`, () => {
    beforeAll(() => {
      assignment = {
        labelers: [
          'l-one@email.com',
          'l-two@email.com',
          'l-three@email.com',
          'l-four@email.com',
          'l-file@email.com',
          'l-six@email.com',
          'l-seven@email.com',
          'l-eight@email.com',
          'l-nine@email.com',
          'l-ten@email.com',
        ],
        reviewers: ['r-one@email.com', 'r-two@email.com'],
      };

      documents = [{ fileName: 'dummy-1' }] as Document[];
    });

    it('should give all labelers at least 1 document', () => {
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
                strategy: 'AUTO',
              },
              splitDocumentOption: splitDocumentOption,
              projectSettings: {
                consensus: 1,
              },
            },
          } as Config;
        });
      const documentAssignments = assignAutoDocuments(assignment, documents);
      expect(checkAllLabelerHaveDocuments(documentAssignments, assignment.labelers)).toEqual(true);
      expect(documentsToHaveBeenSplit(documentAssignments, documents, splitDocumentOption)).toEqual(true);
    });
  });
});

function checkConsensusReachable(documentAssignments: DocumentAssignment[], minimumNumber = 0) {
  const documentMap = new Map<string, number>();
  documentAssignments.forEach((assignment) => {
    if (assignment && assignment.documents)
      assignment.documents.forEach((doc) => {
        const key = doc.fileName + doc.part;
        const count = documentMap.get(key) ?? 0;
        documentMap.set(key, count + 1);
      });
  });

  for (const [key, value] of documentMap) {
    if (value < minimumNumber) {
      return false;
    }
  }
  return true;
}

function checkAllLabelerHaveDocuments(documentAssignments: DocumentAssignment[], labelers: string[]) {
  const labelerMap = new Map<string, number>();
  labelers.forEach((labeler) => labelerMap.set(labeler, 0));

  for (const documentAssignment of documentAssignments) {
    const key = documentAssignment.email as string;
    const currentNumber = labelerMap.get(key) ?? 0;
    labelerMap.set(key, currentNumber + 1);
  }

  for (const [_email, countAssigned] of labelerMap) {
    if (countAssigned < 1) return false;
  }
  return true;
}

function documentsToHaveBeenSplit(
  documentAssignments: DocumentAssignment[],
  documents: Document[],
  splitDocumentOption: Config['create']['splitDocumentOption'],
) {
  const splitCount = splitDocumentOption?.number ?? 0;
  const documentMap = new Map<string, number>();
  documents.forEach((doc) => documentMap.set(doc.fileName, 0));

  for (const documentAssignment of documentAssignments) {
    if (documentAssignment.documents) {
      for (const document of documentAssignment.documents) {
        const maximumPartNumber = documentMap.get(document.fileName) ?? 0;
        if (maximumPartNumber < document.part) {
          documentMap.set(document.fileName, document.part);
        }
      }
    }
  }

  for (const [_key, value] of documentMap) {
    if (value + 1 < splitCount) {
      return false;
    }
  }
  return true;
}
