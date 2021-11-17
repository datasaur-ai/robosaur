import { gql } from 'graphql-request';
import { query } from './query';

const CREATE_LABEL_SET_MUTATION = gql`
  mutation CreateLabelSetMutation($input: CreateLabelSetInput!) {
    result: createLabelSet(input: $input) {
      id
      index
    }
  }
`;

interface LabelItem {
  id: string;
  parentId?: string | null;
  label: string;
  color?: string | null;
}

export async function createLabelSet(name: string, index: number, labelItems: LabelItem[]) {
  const variables = {
    input: { index, name, tagItems: labelItems.map(({ id, parentId, label, color }) => ({ id, parentId, tagName: label, color })) }
  };
  const data = await query(CREATE_LABEL_SET_MUTATION, variables);
  return data.result;
}
