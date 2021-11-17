import { gql } from 'graphql-request';
import { requestAllPages } from './utils/request-all-pages';

const GET_PROJECTS_QUERY = gql`
  query GetProjectsQuery($input: GetProjectsPaginatedInput!) {
    result: getProjects(input: $input) {
      nodes {
        id
        name
        tags {
          id
          name
        }
        __typename
      }
      pageInfo {
        nextCursor
        prevCursor
        __typename
      }
    }
  }
`;

export async function getProjects(filter) {
  return requestAllPages(GET_PROJECTS_QUERY, filter);
}
