import { gql } from 'graphql-request';
import { query } from './query';

const UPDATE_PROJECT_TAG_MUTATION = gql`
  mutation UpdateProjectMutation($input: UpdateProjectInput!) {
    result: updateProject(input: $input) {
      id
      tags {
        id
        name
      }
    }
  }
`;

export async function updateProjectTag(projectId, tagIds) {
  const variables = {
    input: {
      tagIds,
      projectId: projectId,
    },
  };
  await query(UPDATE_PROJECT_TAG_MUTATION, variables);
}
