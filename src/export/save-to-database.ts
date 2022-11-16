import { readdirSync } from 'fs';
import path, { resolve } from 'path';
import { getConfig } from '../config/config';
import { Team15 } from '../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../database/repository';
import { getLogger } from '../logger';
import { readJSONFile } from '../utils/readJSONFile';
import { deleteFolder } from './delete-folder';
import { postProcessDocumentData } from './post-process';

export async function saveExportResultsToDatabase(id: number) {
  const team15Repository = await getRepository(Team15);
  const outputPath = getConfig().export.prefix;

  const directories = readdirSync(outputPath, { withFileTypes: true }).filter((p) => p.isDirectory());
  const folders = directories.map((dir) => resolve(outputPath, dir.name));
  getLogger().info(`found ${folders.length} projects to save into database...`);

  for (const folder of folders) {
    let documentData = {};
    let readingResult = {};

    getLogger().info(`processing export results of project ${folder}...`);
    const files = readdirSync(folder);
    for (const file of files) {
      getLogger().info(`checking file ${file}...`);
      const json = readJSONFile(resolve(folder, file));

      const filenameWithExtension = path.parse(file).name.split('_');
      filenameWithExtension.splice(-2);
      const filename = filenameWithExtension.join('_');

      getLogger().info(`post processing document_data of ${file}...`);
      documentData[filename] = await postProcessDocumentData(json.document_data);
      readingResult[filename] = json.reading_result;
    }

    const record = await team15Repository.findOneByOrFail(Number(id));

    record.document_data = documentData;
    record.document_data_initial = documentData;
    record.reading_result = readingResult;

    await team15Repository.update({ _id: record._id }, record);

    deleteFolder(folder);
  }
}
