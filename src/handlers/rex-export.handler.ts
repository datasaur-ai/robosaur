import { handleExportProjects } from './export-projects.handler';
import { saveExportResultsToDatabase } from '../export/save-to-database';
import { sendRequestToEndpoint } from '../export/send-request';
import { Team15 } from '../database/entities/teamPayloads/team_15.entity';

export async function handleExport(configFile: string, data: Team15, errorCallback: (error: Error) => Promise<void>) {
  // TODO: implement post processing and delete the exported file
  await handleExportProjects(configFile, { unzip: true, deleteProjectAfterExport: true }, errorCallback);

  // receives json format with reading_result and document_data
  await saveExportResultsToDatabase(configFile, data.id);

  await sendRequestToEndpoint(configFile, data.id);
}
