import { gql } from 'graphql-request';
import { query } from './query';

const UPDATE_CUSTOM_API = gql`
  mutation UpdateCustomAPIMutation($customAPIId: ID!, $input: UpdateCustomAPIInput!) {
    updateCustomAPI(customAPIId: $customAPIId, input: $input) {
      id
      endpointURL
    }
  }
`;

export async function updateCustomAPI(customAPIId, name, endpointURL, secret) {
  const variables = {
    customAPIId,
    input: {
      name,
      endpointURL,
      secret: secret ?? null,
    },
  };

  await query(UPDATE_CUSTOM_API, variables);
}
