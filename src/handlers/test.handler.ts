import { setConfigByJSONFile } from '../config/config';
import { getDatabaseValidators } from '../config/schema/validator';
import { initDatabase } from '../database';
import { DocumentData, ReadingResult } from '../database/entities/base-payload.entity';
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
    id: 1,
    file_page_size: 1,
    file_type: 'DUMMY',
    filename: 'DUMMY',
    hcp_ori_document_dir: 'DUMMY',
    original_filename: 'DUMMY',
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

  const documentData: DocumentData = {
    '4323_000': {
      jenis_dokumen: {
        id: 'a6e3827d-4448-4439-b378-0044761f2d08',
        box: [
          {
            x: 538,
            y: 252,
          },
          {
            x: 946,
            y: 293,
          },
        ],
        confidence_mapping: 99.99,
        confidence_reading: 99.8,
        text: 'COMMERCIAL INVOICE',
        ori_text: 'COMMERCIAL INVOICE',
      },
    },
  };

  const reading_result: ReadingResult = {
    '4323_000': [[[1066, 683, 1159, 708], '9/23/2018', 'tanggal_dokumen', 94.75]],
  };

  await col15Repo.insertOne({
    continuous_index: [0],
    document_data: documentData,
    document_data_initial: documentData,
    document_extension: 'DUMMY',
    end_ocr: 'DUMMY',
    filename: 'DUMMY',
    hcp_ori_document_dir: 'DUMMY',
    original_filename: 'DUMMY',
    page_count: 'DUMMY',
    parsed_image_dir: 'DUMMY',
    reading_result: reading_result,
    received_request: 'DUMMY',
    id: 1,
  });

  process.exit(0);
}
