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
  fileTransformerId?: string,
): Promise<ExportResult> {
  const variables = {
    input: {
      projectIds: [projectId],
      fileTransformerId,
      role: 'REVIEWER',
      format: format,
      fileName,
      method: 'FILE_STORAGE',
      includedCommentType: ['COMMENT', 'SPAN_LABEL', 'ARROW_LABEL', 'SPAN_TEXT'],
    },
  };
  const data = await query(EXPORT_PROJECT_QUERY, variables);
  return data.result;
}
