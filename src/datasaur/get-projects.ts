import { gql } from 'graphql-request';
import { requestAllPages } from './utils/request-all-pages';

export interface ExistingProject {
  id: string;
  name: string;
  tags: Array<{ id: string; name: string }>;
}

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

export async function getProjects(filter): Promise<ExistingProject[]> {
  return requestAllPages(GET_PROJECTS_QUERY, filter);
}
