import { gql } from 'graphql-request';
import { query } from './query';

const GET_TAGS_QUERY = gql`
  query GetTagsQuery($input: GetTagsInput!) {
    result: getTags(input: $input) {
      id
      name
    }
  }
`;

export interface Tag {
  id: string;
  name: string;
}

export async function getTags(teamId): Promise<Tag[]> {
  const variables = {
    input: {
      teamId,
    },
  };
  const data = await query(GET_TAGS_QUERY, variables);
  return data.result;
}
