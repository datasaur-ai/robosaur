import { gql } from 'graphql-request';
import { query } from './query';

const EXPORT_PROJECT_QUERY = gql`
  query ExportProjectQuery($input: ExportTextProjectInput!) {
    result: exportTextProject(input: $input) {
      redirect
      queued
      fileUrl
      fileUrlExpiredAt
    }
  }
`;

export async function exportProject(projectId, fileName, format, customScriptId?: string) {
  const variables = {
    input: {
      projectIds: [projectId],
      customScriptId,
      role: 'REVIEWER',
      format: format,
      fileName,
      method: 'FILE_STORAGE',
    },
  };
  return await query(EXPORT_PROJECT_QUERY, variables);
}
