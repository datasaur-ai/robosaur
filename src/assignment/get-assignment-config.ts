import { getLogger } from '../logger';
import { AssignmentConfig } from './interfaces';
import { parseAssignment } from './parse-assignment';
import { validateAssignment } from './validate-assignments';

export async function getAssignmentConfig(): Promise<AssignmentConfig> {
  getLogger().info('parsing assignments');
  const assignees = await parseAssignment();
  getLogger().info('validating project assignment...');
  await validateAssignment(assignees);
  return assignees;
}
