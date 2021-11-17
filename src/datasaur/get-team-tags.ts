import { gql } from 'graphql-request';
import { query } from './query';

const GET_TEAM_TAGS = gql`
  query GetTagsQuery($input: GetTagsInput!) {
    result: getTags(input: $input) {
      ...TagFragment
      __typename
    }
  }
  fragment TagFragment on Tag {
    id
    name
    __typename
  }
`;

export async function getTeamTags(teamId) {
  const variables = {
    input: {
      teamId,
    },
  };
  const data = await query(GET_TEAM_TAGS, variables);
  return data.result;
}
