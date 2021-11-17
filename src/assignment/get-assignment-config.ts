import { difference } from 'lodash';
import { getConfig } from '../config/config';
import { getTeamMembers } from '../datasaur/get-team-members';
import { AssignmentConfig } from './interfaces';

export async function getAssignmentConfig(): Promise<AssignmentConfig> {
  const assignees = getConfig().assignment;
  const projectSetting = getConfig().project;
  const allMembers = await getTeamMembers(projectSetting.teamId);

  const teamMemberEmails = new Set<string>();
  allMembers.forEach((member) => {
    if (member.user && member.user.email) {
      teamMemberEmails.add(member.user.email);
    } else if (member.invitationEmail) {
      teamMemberEmails.add(member.invitationEmail);
    }
  });
  const memberEmails = Array.from(teamMemberEmails);

  if (assignees.labelers.length === 0) {
    throw new Error(`No labeler is registered. Please assign labelers at ./config/assignment-pool.json`);
  }

  const labelerEmailDiferrences = difference(assignees.labelers, memberEmails);
  if (labelerEmailDiferrences.length > 0) {
    console.error('There are some labelers that have not been registered to the team.');
    console.error(JSON.stringify([...labelerEmailDiferrences]));
    throw new Error(`There are some labelers that haven't been registered to the team.`);
  }

  const reviewerEmailDiferrences = difference(assignees.reviewers, memberEmails);
  if (reviewerEmailDiferrences.length > 0) {
    console.error('There are some reviewers that have not been registered to the team.');
    console.error(JSON.stringify([...reviewerEmailDiferrences]));
    throw new Error(`There are some reviewers that haven't been registered to the team.`);
  }

  return assignees;
}
