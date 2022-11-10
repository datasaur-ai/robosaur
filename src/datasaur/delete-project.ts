import { gql } from 'graphql-request';
import { query } from './query';

const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProjectMutation($input: DeleteProjectInput!) {
    result: deleteProject(input: $input) {
      id
    }
  }
`;

export async function deleteProject(projectId: string) {
  const variables = {
    input: {
      projectId,
    },
  };

  const data = await query(DELETE_PROJECT_MUTATION, variables);
  return data.result;
}
