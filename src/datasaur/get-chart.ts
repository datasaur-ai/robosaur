import { gql } from 'graphql-request';
import { query } from './query';

const EXPORT_CHART_QUERY = gql`
  query ExportChartQuery($id: ID!, $input: AnalyticsDashboardQueryInput!, $method: ExportChartMethod) {
    result: exportChart(id: $id, input: $input, method: $method) {
      fileUrl
    }
  }
`;

export async function exportChart(id: string, teamId: string, dateRange?: string) {
  const variables = {
    id,
    input: {
      teamId,
      calendarDate: dateRange,
    },
    method: 'FILE_STORAGE',
  };

  return await query(EXPORT_CHART_QUERY, variables);
}
