import { difference } from 'lodash';
import { getLogger } from '../logger';
import { getActiveTeamId, getConfig } from '../config/config';
import { getTeamMembers } from '../datasaur/get-team-members';

export async function validateAssignment(assignees: {
  labelers: string[];
  reviewers: string[];
  useTeamMemberId?: boolean;
}) {
  getLogger().info('validating assignments...');
  const teamMembers = await getTeamMembers(getActiveTeamId());
  const useTeamMemberId = assignees.useTeamMemberId;
  let memberIdentifiers;
  if (useTeamMemberId) {
    memberIdentifiers = Array.from(new Set(teamMembers.map((member) => member.id)));
  } else {
    memberIdentifiers = Array.from(
      new Set(
        teamMembers.map((member) => {
          if (member.user && member.user.email) {
            return member.user.email;
          } else if (member.invitationEmail) {
            return member.invitationEmail;
          }
        }),
      ),
    );
  }

  getLogger().info('memberIdentifiers', memberIdentifiers);

  if (assignees.labelers.length === 0) {
    getLogger().warn(
      'no labeler is registered. To setup project assignment please configure your config.assignment settings.',
    );
  }

  const labelerEmailDiferrences = difference(assignees.labelers, memberIdentifiers);
  if (labelerEmailDiferrences.length > 0) {
    getLogger().error('there are some labelers that have not been registered to the team.', {
      labeler: [...labelerEmailDiferrences],
    });
    throw new Error(`there are some labelers that haven't been registered to the team.`);
  }

  const reviewerEmailDiferrences = difference(assignees.reviewers, memberIdentifiers);
  if (reviewerEmailDiferrences.length > 0) {
    getLogger().error('there are some reviewers that have not been registered to the team.', {
      reviewer: [...reviewerEmailDiferrences],
    });
    throw new Error(`there are some reviewers that haven't been registered to the team.`);
  }
}
