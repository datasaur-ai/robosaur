import { gql } from 'graphql-request';
import { CabinetLabelSet } from './interfaces';
import { query } from './query';

const GET_CABINET_LABEL_SETS = gql`
  query GetCabinetLabelSets($cabinetId: ID!) {
    result: getCabinetLabelSetsById(cabinetId: $cabinetId) {
      id
      index
      name
    }
  }
`;

export async function getCabinetLabelSetsById(cabinetId: string): Promise<CabinetLabelSet[]> {
  const variables = {
    cabinetId,
  };
  const data = await query(GET_CABINET_LABEL_SETS, variables);
  return data.result;
}
