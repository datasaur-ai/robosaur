import { gql } from 'graphql-request';
import { ExportFormat, ExportResult } from './interfaces';
import { query } from './query';

const EXPORT_PROJECT_QUERY = gql`
  query ExportProjectQuery($input: ExportTextProjectInput!) {
    result: exportTextProject(input: $input) {
      redirect
      queued
      fileUrl
      fileUrlExpiredAt
      exportId
    }
  }
`;

export async function exportProject(
  projectId: string,
  fileName: string,
  format: ExportFormat,
  customScriptId?: string,
): Promise<ExportResult> {
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
  const data = await query(EXPORT_PROJECT_QUERY, variables);
  return data.result;
}
