import { setConfigByJSONFile } from '../config/config';
import { getDatabaseValidators } from '../config/schema/validator';
import { initDatabase } from '../database';
import { DocumentData, ReadingResult } from '../database/entities/base-payload.entity';
import { DataPayload } from '../database/entities/data';
import { DocumentQueueEntity } from '../database/entities/document_queue.entity';
import { Team15 } from '../database/entities/teamPayloads/team_15.entity';
import { TeamsEntity } from '../database/entities/teams.entity';
import { getRepository } from '../database/repository';

export async function handleTest(configFile: string) {
  setConfigByJSONFile(configFile, getDatabaseValidators());
  initDatabase();

  const data: DataPayload = {
    id: 1,
    file_page_size: 1,
    file_type: 'a',
    filename: 'a',
    hcp_ori_document_dir: 'a',
    original_filename: 'asdf',
    parsed_image_dir: 'a',
    team_id: 1,
  };

  const document = new DocumentQueueEntity();
  document.data = data;
  document.team = 1;
  document.id = 2;
  document.save_keeping_id = 1;

  const team = new TeamsEntity();
  team.name = 'test';
  team.url = '';
  team.id = 1;

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
    document_extension: 'asd',
    end_ocr: 'asd',
    filename: 'asd',
    hcp_ori_document_dir: 'asd',
    original_filename: 'asd',
    page_count: 'asd',
    parsed_image_dir: 'asd',
    reading_result: reading_result,
    received_request: 'ad',
    id: 1,
  });

  process.exit(0);
}
