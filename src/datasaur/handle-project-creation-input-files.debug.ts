import { Team15 } from '../database/entities/teamPayloads/team_15.entity';
import { handleProjectCreationInputFiles } from './handle-project-creation-input-files';

export async function debugHandleProjectCreationInputFiles(): Promise<void> {
  const data = new Team15();
  data.id = 10002;
  data.filename = '2.invoice';
  data.reading_result = {};
  data.document_data_initial = {};
  data.document_data = {};
  data.hcp_ori_document_dir = '/original/4/10242022/10002.jpg';
  data.original_filename = '2.invoice.jpg';
  data.parsed_image_dir = '/surat-instruksi/parsed/10002';
  data.document_extension = 'jpg';
  data.page_count = '2';

  await handleProjectCreationInputFiles(data);
}
