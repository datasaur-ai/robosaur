import { AssignmentConfig } from '../../../assignment/interfaces';
import { DocumentAssignmentInput, ProjectAssignmentRole } from '../../../generated/graphql';
import { documentAssignmentsMapper } from './document-assignments.mapper';

describe('documentAssignmentsMapper', () => {
  it('should map documentAssignments from PCW to robosaur config', () => {
    const fromPcw: DocumentAssignmentInput[] = [
      {
        teamMemberId: '1',
        documents: [
          {
            fileName: 'lorem.txt',
            part: 0,
          },
        ],
        role: ProjectAssignmentRole.LabelerAndReviewer,
      },
      {
        teamMemberId: '2',
        documents: [
          {
            fileName: 'lorem.txt',
            part: 0,
          },
        ],
        role: ProjectAssignmentRole.Labeler,
      },
    ];

    const mapped: AssignmentConfig = {
      labelers: ['1', '2'],
      reviewers: ['1'],
      useTeamMemberId: true,
    };

    const result = documentAssignmentsMapper.fromPcw(fromPcw);

    expect(result).toEqual(mapped);
  });
});
