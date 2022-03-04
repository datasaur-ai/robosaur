import { getConfig } from '../config/config';
import { Document } from '../documents/interfaces';
import { getLogger } from '../logger';
import { getDocumentsWithPart } from './get-documents-with-part';
import { getRole } from './get-role';
import { AssignmentConfig, DocumentAssignment } from './interfaces';

export function assignAutoDocuments(assignmentPool: AssignmentConfig, documents: Document[]): DocumentAssignment[] {
  const allDocuments = getDocumentsWithPart(documents);

  const members: Record<string, { isLabeler: boolean; isReviewer: boolean }> = {};
  assignmentPool.labelers.forEach((labeler) => {
    members[labeler] = { isLabeler: true, isReviewer: false };
  });
  assignmentPool.reviewers.forEach((reviewer) => {
    members[reviewer] = { isLabeler: false || members[reviewer]?.isLabeler, isReviewer: true };
  });

  const consensus = getConfig()?.project?.projectSettings?.consensus ?? 1;

  const labelerAssignmentMap = new Map<string, Array<{ fileName: string; part: number }>>();
  const labelerEmails: string[] = [];
  const reviewerEmails: string[] = [];
  Object.entries(members).forEach(([email, { isLabeler, isReviewer }]) => {
    if (isLabeler) {
      // labeler and labeler_and_reviewer can be assigned documents
      labelerAssignmentMap.set(email, []);
      labelerEmails.push(email);
    } else if (isReviewer) {
      // reviewers does not need to be assigned - they can access all
      reviewerEmails.push(email);
    }
  });

  if (consensus > labelerEmails.length) {
    getLogger().error('Consensus lower than number of labelers');
    throw new Error('Consensus should be smaller or equal to number of labelers');
  }

  let labelerIndex = 0;
  for (let index = 0; index < allDocuments.length; index++) {
    const document = allDocuments[index];

    let numberOfAssignments = 0;
    while (numberOfAssignments < consensus) {
      const currentLabeler = labelerEmails[labelerIndex];
      const assignedDocs = labelerAssignmentMap.get(currentLabeler);
      labelerAssignmentMap.set(currentLabeler, [
        ...assignedDocs!,
        { fileName: document.fileName, part: document.part },
      ]);
      numberOfAssignments += 1;
      labelerIndex = (labelerIndex + 1) % labelerEmails.length;
    }
  }

  const unassignedLabelers: string[] = [];
  labelerAssignmentMap.forEach((value, email) => {
    if (value.length === 0) {
      unassignedLabelers.push(email);
    }
  });

  // handle case when labeler.length > file.length
  let documentIndex = 0;
  unassignedLabelers.forEach((email) => {
    const document = allDocuments[documentIndex];
    labelerAssignmentMap.set(email, [{ fileName: document.fileName, part: document.part }]);
    documentIndex = (documentIndex + 1) % allDocuments.length;
  });

  const retval: DocumentAssignment[] = [];
  labelerAssignmentMap.forEach((value, key) => {
    retval.push({ email: key, documents: value, role: getRoleFromEmail(key, members) });
  });
  reviewerEmails.forEach((email) => {
    retval.push({ email, role: getRoleFromEmail(email, members) });
  });

  return retval;
}

function getRoleFromEmail(email: string, members: Record<string, { isLabeler: boolean; isReviewer: boolean }>) {
  const member = Object.entries(members).find((p) => p[0] === email)!;
  return getRole(member[1].isLabeler, member[1].isReviewer);
}
