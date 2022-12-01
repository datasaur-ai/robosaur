import { gql } from 'graphql-request';
import { AutoLabelProjectOptionsInput, Role, TargetApiInput } from '../generated/graphql';
import { query } from './query';

const AUTO_LABEL_TOKEN_BASED_MUTATION = gql`
  mutation AutoLabelTokenBasedMutation($input: AutoLabelTokenBasedProjectInput!) {
    result: autoLabelTokenBasedProject(input: $input) {
      id
    }
  }
`;

export async function autoLabelTokenProject(
  projectId: string,
  labelerEmail: string,
  targetAPI: TargetApiInput,
  options: AutoLabelProjectOptionsInput,
  role?: Role,
) {
  const variables = {
    input: {
      labelerEmail,
      targetAPI,
      options,
      projectId,
      role,
    },
  };

  const data = await query(AUTO_LABEL_TOKEN_BASED_MUTATION, variables);
  return data.result;
}
