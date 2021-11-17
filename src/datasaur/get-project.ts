import { gql } from 'graphql-request';
import { query } from './query';

const GET_PROJECT_QUERY = gql`
  query GetProjectQuery($input: GetProjectInput!) {
    result: getProject(input: $input) {
      id
      name
      tags {
        id
        name
      }
    }
  }
`;

export async function getProject(projectId) {
  const variables = {
    input: {
      projectId,
    },
  };
  const data = await query(GET_PROJECT_QUERY, variables);
  return data.result;
}
