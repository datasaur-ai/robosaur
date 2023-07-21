import { gql } from 'graphql-request';
import { ProjectWithAssignment } from './interfaces';
import { query } from './query';

const GET_PROJECT_WITH_ASSIGNMNET_QUERY = gql`
  query GetProjectsWithAssignmentQuery($input: GetProjectsPaginatedInput!) {
    result: getProjects(input: $input) {
      nodes {
        id
        name
        tags {
          id
          name
        }
        createdDate
        completedDate
        assignees {
          role
          teamMember {
            user {
              id
            }
          }
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

export async function getProjectsWithAssignment(teamId: string) {
  const projects: ProjectWithAssignment[] = [];
  const variables = {
    input: {
      filter: {
        teamId,
      },
      page: { skip: 0, take: 100 },
    },
  };

  let data = await query(GET_PROJECT_WITH_ASSIGNMNET_QUERY, variables);
  while (true) {
    projects.push(...data.result.nodes);

    if (data.result.pageInfo.nextCursor === null) {
      break;
    }

    const nextVarialbes = {
      input: {
        filter: {
          teamId,
        },
        cursor: data.result.pageInfo.nextCursor,
      },
    };

    data = await query(GET_PROJECT_WITH_ASSIGNMNET_QUERY, nextVarialbes);
  }

  return projects;
}
