import { ProjectAssignmentRole } from './interfaces';

export function getRole(isLabeler: boolean, isReviewer: boolean): ProjectAssignmentRole | null {
  if (isLabeler && isReviewer) {
    return ProjectAssignmentRole.LABELER_AND_REVIEWER;
  }
  if (isLabeler) {
    return ProjectAssignmentRole.LABELER;
  }
  if (isReviewer) {
    return ProjectAssignmentRole.REVIEWER;
  }
  return null;
}
