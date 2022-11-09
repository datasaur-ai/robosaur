import { readdirSync } from 'fs';
import path, { resolve } from 'path';
import { getConfig, setConfigByJSONFile } from '../config/config';
import { getDatabaseValidators } from '../config/schema/validator';
import { initDatabase } from '../database';
import { Team15 } from '../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../database/repository';
import { getLogger } from '../logger';
import { readJSONFile } from '../utils/readJSONFile';
import { postProcessDocumentData } from './post-process';

export async function saveExportResultsToDatabase(configFile: string, id: number) {
  setConfigByJSONFile(configFile, getDatabaseValidators());
  initDatabase();

  const team15Repository = await getRepository(Team15);
  const outputPath = getConfig().export.prefix;

  const directories = readdirSync(outputPath, { withFileTypes: true }).filter((p) => p.isDirectory());
  const folders = directories.map((dir) => resolve(outputPath, dir.name));
  getLogger().info(`found ${folders.length} projects to save into database...`);

  for (const folder of folders) {
    let documentData = {};
    let readingResult = {};

    getLogger().info(`processing export results of project ${folder}...`);
    readdirSync(folder).forEach(async (file) => {
      getLogger().info(`checking file ${file}...`);
      const json = readJSONFile(resolve(folder, file));

      // file name should be <ID>_<PAGE_NUMBER>.jpg
      const filename = path.parse(file).name;
      documentData[filename] = postProcessDocumentData(json.document_data);
      readingResult[filename] = json.reading_result;
    });

    const record = await team15Repository.findOneByOrFail(Number(id));

    record.document_data = documentData;
    record.document_data_initial = documentData;
    record.reading_result = readingResult;

    await team15Repository.save(record);
  }
}
