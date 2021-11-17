import { query } from '../query';

export async function requestAllPages(QUERY, filter, sort = []) {
  let pagination: any = { page: { skip: 0, take: 100 } };

  const allNodes = [];
  while (true) {
    const data = await query(QUERY, {
      input: { filter, sort, ...pagination },
    });
    allNodes.push(...data.result.nodes);

    if (data.result.pageInfo.nextCursor === null) {
      break;
    }
    pagination = { cursor: data.result.pageInfo.nextCursor };
  }

  return allNodes;
}
