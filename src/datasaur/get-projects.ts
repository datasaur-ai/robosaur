import { gql } from 'graphql-request';
import { Project } from './interfaces';
import { requestAllPages } from './utils/request-all-pages';
import { requestByPage } from './utils/request-by-page';

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
        createdDate
        completedDate
      }
      pageInfo {
        nextCursor
        prevCursor
        __typename
      }
      totalCount
    }
  }
`;

export async function getProjects(filter): Promise<Project[]> {
  return requestAllPages(GET_PROJECTS_QUERY, filter);
}

export async function getPaginatedProjects(filter, skip: number, take = 100) {
  return requestByPage<Project>(GET_PROJECTS_QUERY, filter, { skip, take });
}
