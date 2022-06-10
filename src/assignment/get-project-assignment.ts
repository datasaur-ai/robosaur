import { assignAllDocuments } from './assign-all-documents';
import { getConfig } from '../config/config';
import { AssignmentConfig } from './interfaces';
import { Document } from '../documents/interfaces';

export function getProjectAssignment(
  assignees: AssignmentConfig,
  documents: Document[],
  selectedLabelers: string[],
  selectedReviewers: string[],
) {
  let assignmentStrategy;
  if (assignees.useTeamMemberId) {
    assignmentStrategy = getConfig()?.create?.pcwAssignmentStrategy;
  } else {
    assignmentStrategy = getConfig()?.create?.assignment?.strategy;
    assignees.labelers = selectedLabelers;
    assignees.reviewers = selectedReviewers;
  }
  return assignAllDocuments(assignees, documents);
}
