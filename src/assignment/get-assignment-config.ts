import { AssignmentConfig } from './interfaces';
import { parseAssignment } from './parse-assignment';
import { validateAssignment } from './validate-assignments';

export async function getAssignmentConfig(): Promise<AssignmentConfig> {
  const assignees = await parseAssignment();
  await validateAssignment(assignees);
  return assignees;
}
