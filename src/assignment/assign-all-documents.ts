import { Document } from '../documents/interfaces';
import { getDocumentsWithPart } from './get-documents-with-part';
import { getRole } from './get-role';
import { AssignmentConfig, DocumentAssignment } from './interfaces';

export function assignAllDocuments(assignmentPool: AssignmentConfig, documents: Document[]): DocumentAssignment[] {
  const allDocuments = getDocumentsWithPart(documents);

  const members: Record<string, { isLabeler: boolean; isReviewer: boolean }> = {};
  assignmentPool.labelers.forEach((labeler) => {
    members[labeler] = { isLabeler: true, isReviewer: false };
  });
  assignmentPool.reviewers.forEach((reviewer) => {
    members[reviewer] = { isLabeler: false || members[reviewer]?.isLabeler, isReviewer: true };
  });
  if (assignmentPool.useTeamMemberId) {
    return Object.entries(members).map(([memberId, { isLabeler, isReviewer }]) => {
      return { teamMemberId: memberId, role: getRole(isLabeler, isReviewer), documents: allDocuments };
    });
  } else {
    return Object.entries(members).map(([memberEmail, { isLabeler, isReviewer }]) => {
      return { email: memberEmail, role: getRole(isLabeler, isReviewer), documents: allDocuments };
    });
  }
}
