import { readdirSync } from 'fs';
import path, { resolve } from 'path';
import { getConfig } from '../config/config';
import { getLogger } from '../logger';
import { readJSONFile } from '../utils/readJSONFile';
import { deleteFolder } from './delete-folder';
import { postProcessDocumentData } from './post-process';
import { getTeamRepository } from '../database/repository';
import { formatDate } from '../datasaur/utils/format-date';
import { OCR_STATUS } from '../datasaur/rex/interface';
import { checkRecordStatus } from '../datasaur/rex/check-record-status';

function addLeadingZeros(num: number, totalLength: number): string {
  return String(num).padStart(totalLength, '0');
}

/**
 *
 * Updating status and save the ocr reading result to database
 */
export async function saveExportResultsToDatabase(teamId: number, id: number) {
  const teamRepository = await getTeamRepository();
  const outputPath = getConfig().export.prefix;

  const directories = readdirSync(outputPath, { withFileTypes: true }).filter((p) => p.isDirectory());
  const folders = directories.map((dir) => resolve(outputPath, dir.name));
  getLogger().info(`found ${folders.length} projects to save into database...`);

  for (const folder of folders) {
    let documentData = {};
    let readingResult = {};

    getLogger().info(`processing export results of project ${folder}...`);
    const files = readdirSync(folder);

    const record = await teamRepository.findOneOrFail({
      where: {
        _id: id,
      },
    });

    for (let i = 0; i < record.page_count; i++) {
      const filename = id + '_' + addLeadingZeros(i, 3);
      documentData[filename] = null;
      readingResult[filename] = null;
    }

    for (const file of files) {
      getLogger().info(`checking file ${file}...`);
      const json = readJSONFile(resolve(folder, file));

      const filenameWithExtension = path.parse(file).name.split('_');
      filenameWithExtension.splice(-2);
      const filename = filenameWithExtension.join('_');

      await checkRecordStatus(id);

      getLogger().info(`post processing document_data of ${file}...`);
      documentData[filename] = await postProcessDocumentData(json.document_data);
      readingResult[filename] = json.reading_result;
    }

    await checkRecordStatus(id);

    getLogger().info(`Post processing is successful`);
    getLogger().info(`Updating save keeping in database. Before`, record);

    record.document_data = documentData;
    record.document_data_initial = documentData;
    record.reading_result = readingResult;
    record.end_ocr = formatDate(new Date());
    record.ocr_status = OCR_STATUS.READ;
    record.continuous_index = Array(Number(record.page_count ?? 1)).fill(0);

    await teamRepository.update({ _id: record._id }, record);

    getLogger().info(`Updating save keeping in database. After`, record);

    deleteFolder(folder);
  }
}
