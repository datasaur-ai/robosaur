import { gql } from 'graphql-request';
import { query } from '../../datasaur/query';

const GET_PROJECTS_FINAL_REPORT_QUERY = gql`
  query GetProjectsFinalReport($projectIds: [ID!]!) {
    result: getProjectsFinalReport(projectIds: $projectIds) {
      project {
        id
        name
        workspaceSettings {
          kinds
        }
      }
      documentFinalReports {
        rowFinalReports {
          line
          finalReport {
            totalAppliedLabels
            totalAcceptedLabels
            totalRejectedLabels
            precision
            recall
          }
        }
        cabinet {
          role
        }
        document {
          id
          originId
          name
          fileName
        }
        finalReport {
          totalAppliedLabels
          totalAcceptedLabels
          totalRejectedLabels
          precision
          recall
        }
        teamMember {
          id
          user {
            id
            name
            username
            email
          }
        }
      }
    }
  }
`;

export async function getProjectsFinalReport(projectIds: string[]) {
  const variables = {
    projectIds,
  };
  const data = await query(GET_PROJECTS_FINAL_REPORT_QUERY, variables);
  return data.result;
}
