import { gql } from 'graphql-request';
import { CabinetStatus, Role } from '../generated/graphql';
import { query } from './query';

const GET_CABINETS = gql`
  query GetCabinets($projectId: ID!) {
    result: getProjectCabinets(projectId: $projectId) {
      ...CabinetFragment
      __typename
    }
  }

  fragment CabinetFragment on Cabinet {
    id
    documents {
      id
      originId
      fileName
    }
    role
    status
  }
`;

export interface Cabinet {
  id: string;
  role: Role;
  status: CabinetStatus;
  documents: {
    id: string;
    originId?: string;
    fileName: string;
  }[];
}

export async function getCabinets(projectId: string): Promise<Cabinet[]> {
  const variables = {
    projectId,
  };
  return (await query(GET_CABINETS, variables)).result;
}
