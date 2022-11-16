import { setConfigByJSONFile } from '../config/config';
import { getDatabaseValidators } from '../config/schema/validator';
import { initDatabase } from '../database';
import { DataPayload } from '../database/entities/data';
import { DocumentQueueEntity } from '../database/entities/document_queue.entity';
import { Team15 } from '../database/entities/teamPayloads/team_15.entity';
import { TeamsEntity } from '../database/entities/teams.entity';
import { getRepository } from '../database/repository';
import { SI_TEAM_ID } from '../datasaur/rex/interface';

export async function handleTest(configFile: string) {
  setConfigByJSONFile(configFile, getDatabaseValidators());
  initDatabase();

  const data: DataPayload = {
    _id: 1,
    file_page_size: 1,
    file_type: 'pdf',
    filename: '1_0002.pdf',
    hcp_ori_document_dir: '',
    original_filename: '1_0002.pdf',
    parsed_image_dir: 'DUMMY',
    team_id: SI_TEAM_ID,
  };

  const document = new DocumentQueueEntity();
  document.data = data;
  document.team = SI_TEAM_ID;
  document.id = 2;
  document.save_keeping_id = 1;

  const team = new TeamsEntity();
  team.name = 'SURAT_INSTRUKSI';
  team.url = 'DUMMY';
  team.id = SI_TEAM_ID;

  const docRepo = await getRepository(DocumentQueueEntity);

  await docRepo.insertOne(document);

  const teamRepo = await getRepository(TeamsEntity);
  await teamRepo.insertOne(team);

  const col15Repo = await getRepository(Team15);

  await col15Repo.insertOne({
    document_data: {},
    document_data_initial: {},
    document_extension: 'jpg',
    filename: '1_0002.pdf',
    hcp_ori_document_dir: '',
    original_filename: '1_0002.pdf',
    page_count: '1',
    parsed_image_dir: '',
    reading_result: {},
    received_request: '',
    _id: 1,
  });

  process.exit(0);
}
