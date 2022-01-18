import { AssignmentConfig } from './interfaces';
import { parseAssignment } from './parse-assignment';
import { validateAssignments } from './validate-assignments';

export async function getAssignmentConfig(): Promise<AssignmentConfig> {
  const assignees = await parseAssignment();
  await validateAssignments(assignees);
  return assignees;
}
