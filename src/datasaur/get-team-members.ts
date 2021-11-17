import { gql } from 'graphql-request';
import { requestAllPages } from './utils/request-all-pages';

const TEAM_MEMBER_QUERY = gql`
  query GetTeamMembersQuery($input: GetTeamMembersPaginatedInput!) {
    result: getTeamMembersPaginated(input: $input) {
      nodes {
        user {
          email
        }
        invitationStatus
        invitationEmail
        __typename
      }
      pageInfo {
        nextCursor
        prevCursor
        __typename
      }
    }
  }
`;

export async function getTeamMembers(teamId) {
  return await requestAllPages(TEAM_MEMBER_QUERY, {
    teamId: `${teamId}`,
    roleId: [],
    keyword: '',
  });
}
