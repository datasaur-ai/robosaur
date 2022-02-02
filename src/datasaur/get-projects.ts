import { gql } from 'graphql-request';
import { Project } from './interfaces';
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
        status
      }
      pageInfo {
        nextCursor
        prevCursor
        __typename
      }
    }
  }
`;

export async function getProjects(filter): Promise<Project[]> {
  return requestAllPages(GET_PROJECTS_QUERY, filter);
}
