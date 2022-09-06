import { gql } from 'graphql-request';
import { query } from './query';

const GET_CELLS = gql`
  query GetCells($documentId: ID!, $input: GetCellsPaginatedInput!) {
    result: getCells(documentId: $documentId, input: $input) {
      nodes
      totalCount
      pageInfo {
        nextCursor
        prevCursor
        __typename
      }
    }
  }
`;

async function requestAllPages(QUERY, params: any) {
  let pagination: any = { page: { skip: 0, take: 100 } };

  const allNodes: any[] = [];
  while (true) {
    const data = await query(QUERY, {
      input: { ...pagination },
      ...params,
    });
    allNodes.push(...data.result.nodes);

    if (data.result.pageInfo.nextCursor === null) {
      break;
    }
    pagination = { cursor: data.result.pageInfo.nextCursor };
  }

  return allNodes;
}

export interface Metadata {
  key: string;
  value: string;
  pinned: boolean;
}

export interface Cell {
  line: number;
  content: string;
  metadata: Metadata[];
  originCell?: Cell;
}

export async function getCells(documentId: string): Promise<Cell[]> {
  return requestAllPages(GET_CELLS, { documentId });
}
