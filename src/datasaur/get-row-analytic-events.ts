import { gql } from 'graphql-request';
import { query } from './query';

const ROW_ANALYTIC_CELL_EVENT_QUERY = gql`
  query getRowAnalyticEvents($input: RowAnalyticEventInput!) {
    getRowAnalyticEvents(input: $input) {
      pageInfo {
        nextCursor
      }
      nodes {
        cell {
          line
          document {
            id
            fileName
            project {
              id
              name
            }
          }
        }
        createdAt
        event
        id
        user {
          id
          email
          roleName
        }
      }
    }
  }
`;

export function getRowAnalyticEvents(
  teamId: string,
  take: number,
  cursor: string | null,
  startDate?: string,
  endDate?: string,
) {
  return query(ROW_ANALYTIC_CELL_EVENT_QUERY, {
    input: {
      cursor,
      filter: {
        teamId,
        startDate,
        endDate,
      },
      sort: [{ field: 'id', order: 'ASC' }],
      page: { take },
    },
  });
}
