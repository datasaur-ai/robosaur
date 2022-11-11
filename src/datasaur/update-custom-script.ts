import { gql } from 'graphql-request';
import { query } from './query';

const UPDATE_FILE_TRANSFORMER_MUTATION = gql`
  mutation UpdateFileTransformerMutation($input: UpdateFileTransformerInput!) {
    updateFileTransformer(input: $input) {
      id
      name
    }
  }
`;

export async function updateFileTransformer(fileTransformerId, content) {
  const variables = {
    input: {
      fileTransformerId,
      content,
    },
  };

  await query(UPDATE_FILE_TRANSFORMER_MUTATION, variables);
}
