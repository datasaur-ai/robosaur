import { DocumentAssignmentInput } from '../../../generated/graphql';

export const documentAssignmentsMapper = {
  fromPcw: (
    payload: DocumentAssignmentInput[],
  ): {
    labelers: string[];
    reviewers: string[];
    useTeamMemberId?: boolean;
  } => ({
    labelers:
      payload
        ?.filter((member) => member.role === 'LABELER_AND_REVIEWER' || member.role === 'LABELER')
        ?.map((member) => member.teamMemberId || '')
        ?.filter((memberId) => memberId !== '') || [],
    reviewers:
      payload
        ?.filter((member) => member.role === 'LABELER_AND_REVIEWER' || member.role === 'REVIEWER')
        ?.map((member) => member.teamMemberId || '')
        ?.filter((memberId) => memberId !== '') || [],
    useTeamMemberId: true,
  }),
};
