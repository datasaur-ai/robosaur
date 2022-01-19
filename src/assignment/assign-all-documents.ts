import { Document } from '../documents/interfaces';
import { getRole } from './get-role';
import { AssignmentConfig, DocumentAssignment } from './interfaces';

export function assignAllDocuments(assignmentPool: AssignmentConfig, documents: Document[]): DocumentAssignment[] {
  const allDocuments = documents.map((document) => ({
    fileName: document.fileName,
    part: 0,
  }));

  const members: Record<string, { isLabeler: boolean; isReviewer: boolean }> = {};
  assignmentPool.labelers.forEach((labeler) => {
    members[labeler] = { isLabeler: true, isReviewer: false };
  });
  assignmentPool.reviewers.forEach((reviewer) => {
    members[reviewer] = { isLabeler: false || members[reviewer].isLabeler, isReviewer: true };
  });
  return Object.entries(members).map(([memberEmail, { isLabeler, isReviewer }]) => {
    return { email: memberEmail, role: getRole(isLabeler, isReviewer), documents: allDocuments };
  });
}
