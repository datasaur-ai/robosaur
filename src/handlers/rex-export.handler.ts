import { DataPayload } from '../database/entities/data';
import { handleExportProjects } from './export-projects.handler';
import { handleSaveToDatabase } from './save-to-database.handler';
import { sendRequestToEndpoint } from './send-request.handler';

const testDataPayload: DataPayload = {
  id: 1,
  filename: 'si.jpeg',
  parsed_image_dir: 'quickstart/token-based/documents',
  team_id: 1,
  hcp_ori_document_dir: 'si/test/directory',
  file_type: 'SI',
  file_page_size: 999,
  original_filename: 'si.pdf',
};

export async function handleExport(configFile: string, data: DataPayload) {
  // TODO: implement post processing and delete the exported file
  await handleExportProjects(configFile, { unzip: true });

  // receives json format with reading_result and document_data
  await handleSaveToDatabase(configFile, data.id);

  const exportEndpoint = process.env.EXPORT_ENDPOINT ?? '';
  await sendRequestToEndpoint(data.id, exportEndpoint);
}
