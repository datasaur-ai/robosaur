import { query } from '../query';

export interface PaginatedResult<T> {
  nodes: T[];
  pageInfo: {
    nextCursor: string | null;
    prevCursor: string | null;
  };
  totalCount: number;
}

export async function requestByPage<T = unknown>(
  QUERY: string,
  filter: any,
  page: { skip: number; take: number },
  sort: unknown[] = [],
): Promise<PaginatedResult<T>> {
  const data = await query(QUERY, {
    input: { filter, sort, page },
  });

  return { nodes: data.result.nodes, pageInfo: data.result.pageInfo, totalCount: data.result.totalCount };
}
