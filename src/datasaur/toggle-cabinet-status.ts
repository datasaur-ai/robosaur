import { gql } from 'graphql-request';
import { ProjectStatus } from './interfaces';
import { query } from './query';

const TOGGLE_CABINET_MUTATION = gql`
  mutation ToggleCabinetStatusMutation($projectId: ID!) {
    result: toggleCabinetStatus(projectId: $projectId, role: REVIEWER, skipValidation: true) {
      id
      status
    }
  }
`;

export async function toggleCabinetStatus(projectId: string) {
  const data = await query<{ result: { id: string; status: ProjectStatus } }>(TOGGLE_CABINET_MUTATION, { projectId });
  return data.result;
}
