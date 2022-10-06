import { gql } from 'graphql-request';
import { query } from './query';

const AUTO_LABEL_TOKEN_BASED_MUTATION = gql`
  mutation AutoLabelTokenBasedMutation($input: AutoLabelTokenBasedProjectInput!) {
    result: autoLabelTokenBasedProject(input: $input) {
      job {
        id
      }
      name
    }
  }
`;

interface TargetApiInput {
  endpoint: string;
  secretKey: string;
}

interface AutoLabelProjectOptionsInput {
  serviceProvider: string;
  numberOfFilesPerRequest: number;
}

export async function autoLabelTokenProject(
  projectId: string,
  labelerEmail: string,
  targetAPI: TargetApiInput,
  options: AutoLabelProjectOptionsInput,
) {
  const data = await query(AUTO_LABEL_TOKEN_BASED_MUTATION, {
    projectId,
    labelerEmail,
    targetAPI,
    options,
  });

  return data.result;
}
