import { readdirSync } from 'fs';
import { resolve } from 'path';
import { getConfig, setConfigByJSONFile } from '../config/config';
import { getDatabaseValidators } from '../config/schema/validator';
import { initDatabase } from '../database';
import { Team15 } from '../database/entities/teamPayloads/team_15.entity';
import { getRepository } from '../database/repository';
import { getLogger } from '../logger';
import { readJSONFile } from '../utils/readJSONFile';

export async function handleSaveToDatabase(configFile: string) {
  setConfigByJSONFile(configFile, getDatabaseValidators());
  initDatabase();

  const team15Repository = await getRepository(Team15);
  const outputPath = getConfig().export.prefix;

  const directories = readdirSync(outputPath, { withFileTypes: true }).filter((p) => p.isDirectory());
  const folders = directories.map((dir) => resolve(outputPath, dir.name));
  getLogger().info(`found ${folders.length} projects to save into database...`);

  for (const folder of folders) {
    getLogger().info(`saving export results of project ${folder} into database...`);
    readdirSync(folder).forEach(async (file) => {
      getLogger().info(`saving export results of ${file} into database...`);
      const json = readJSONFile(resolve(folder, file));
      await team15Repository.insert(json);
    });
  }
}
