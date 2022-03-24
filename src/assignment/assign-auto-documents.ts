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
  const labelerIdentifier: string[] = [];
  const reviewerIdentifier: string[] = [];
  Object.entries(members).forEach(([identifier, { isLabeler, isReviewer }]) => {
    if (isLabeler) {
      // labeler and labeler_and_reviewer can be assigned documents
      labelerAssignmentMap.set(identifier, []);
      labelerIdentifier.push(identifier);
    } else if (isReviewer) {
      // reviewers does not need to be assigned - they can access all
      reviewerIdentifier.push(identifier);
    }
  });

  if (consensus > labelerIdentifier.length) {
    getLogger().error('Consensus lower than number of labelers');
    throw new Error('Consensus should be smaller or equal to number of labelers');
  }

  let labelerIndex = 0;
  for (let index = 0; index < allDocuments.length; index++) {
    const document = allDocuments[index];

    let numberOfAssignments = 0;
    while (numberOfAssignments < consensus) {
      const currentLabeler = labelerIdentifier[labelerIndex];
      const assignedDocs = labelerAssignmentMap.get(currentLabeler);
      labelerAssignmentMap.set(currentLabeler, [
        ...assignedDocs!,
        { fileName: document.fileName, part: document.part },
      ]);
      numberOfAssignments += 1;
      labelerIndex = (labelerIndex + 1) % labelerIdentifier.length;
    }
  }

  const unassignedLabelers: string[] = [];
  labelerAssignmentMap.forEach((value, identifier) => {
    if (value.length === 0) {
      unassignedLabelers.push(identifier);
    }
  });

  // handle case when labeler.length > file.length
  let documentIndex = 0;
  unassignedLabelers.forEach((identifier) => {
    const document = allDocuments[documentIndex];
    labelerAssignmentMap.set(identifier, [{ fileName: document.fileName, part: document.part }]);
    documentIndex = (documentIndex + 1) % allDocuments.length;
  });

  const retval: DocumentAssignment[] = [];
  if (assignmentPool.use_team_member_id) {
    labelerAssignmentMap.forEach((value, key) => {
      retval.push({ teamMemberId: key, documents: value, role: getRoleFromIdentifier(key, members) });
    });
    reviewerIdentifier.forEach((teamMemberId) => {
      retval.push({ teamMemberId, role: getRoleFromIdentifier(teamMemberId, members) });
    });
  } else {
    labelerAssignmentMap.forEach((value, key) => {
      retval.push({ email: key, documents: value, role: getRoleFromIdentifier(key, members) });
    });
    reviewerIdentifier.forEach((email) => {
      retval.push({ email, role: getRoleFromIdentifier(email, members) });
    });
  }

  return retval;
}

function getRoleFromIdentifier(
  identifier: string,
  members: Record<string, { isLabeler: boolean; isReviewer: boolean }>,
) {
  const member = Object.entries(members).find((p) => p[0] === identifier)!;
  return getRole(member[1].isLabeler, member[1].isReviewer);
}
