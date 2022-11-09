import { DataPayload } from '../database/entities/data';
import { DocumentQueueEntity } from '../database/entities/document_queue.entity';
import { handleProjectCreationInputFiles } from './handle-project-creation-input-files';

export async function debugHandleProjectCreationInputFiles(): Promise<void> {
  const data = new DataPayload();
  data.id = 1;
  data.filename = '2.invoice';
  data.parsed_image_dir = '/surat-instruksi/parsed/10002';
  data.team_id = 1;
  data.hcp_ori_document_dir = '/original/4/10242022/10002.pdf';
  data.file_type = 'pdf';
  data.file_page_size = 10;
  data.original_filename = '2.invoice.pdf';

  const job = new DocumentQueueEntity();
  job.id = 1;
  job.team = 1;
  job.data = data;
  job.save_keeping_id = 1;

  await handleProjectCreationInputFiles(job);
}
