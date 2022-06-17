import { gql } from 'graphql-request';
import { Tag } from '../generated/graphql';
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
    globalTag
    __typename
  }
`;

export async function getTeamTags(teamId): Promise<Tag[]> {
  const variables = {
    input: {
      teamId,
      filter: {
        includeGlobalTag: true,
      },
    },
  };
  const data = await query(GET_TEAM_TAGS, variables);
  return data.result;
}
