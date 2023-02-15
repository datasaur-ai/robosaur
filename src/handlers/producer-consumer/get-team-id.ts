import { getLogger } from '../../logger';

export const getTeamId = () => {
  const teamId = process.env.TEAM_ID;
  if (!teamId) {
    const message = 'Team Id not found in environment variables';
    getLogger().error(message);
    throw new Error(message);
  }
  return teamId;
};
