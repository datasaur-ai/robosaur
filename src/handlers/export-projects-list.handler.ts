import { mkdirSync, writeFileSync } from 'fs';
import Papa from 'papaparse';
import { getConfig, setConfigByJSONFile } from '../config/config';
import { StorageSources } from '../config/interfaces';
import { getProjectListExportValidators } from '../config/schema/validator';
import { getProjects } from '../datasaur/get-projects';
import { getLogger } from '../logger';
import { convertTagNamesToIds } from '../utils/tags/convertTagNamesToIds';
import { ScriptAction } from './constants';

export async function handleExportProjectList(configFile: string) {
  setConfigByJSONFile(configFile, getProjectListExportValidators(), ScriptAction.PROJECT_LIST_EXPORT);

  const { teamId, source, path, projectFilter } = getConfig().exportProjectList;

  // retrieves projects from Datasaur matching the filters
  getLogger().info('retrieving projects with filters', { filter: projectFilter });
  const tagIds = projectFilter?.tags ? await convertTagNamesToIds(teamId, projectFilter.tags) : undefined;
  const projects = await getProjects({
    statuses: projectFilter?.statuses,
    teamId,
    daysCreatedRange: projectFilter?.date
      ? {
          newestDate: projectFilter.date.newestDate,
          oldestDate: projectFilter.date?.oldestDate,
        }
      : undefined,
    tags: tagIds,
  });

  if (projects.length === 0) {
    getLogger().info(`no projects to export, exiting script...`);
    return;
  }
  getLogger().info(`found ${projects.length} projects to export`);

  const projectToExport = projects.map((project) => {
    const tags = project.tags.map((tag) => tag.name);
    return {
      id: project.id,
      name: project.name,
      status: project.status,
      tags,
      createdDate: project.createdDate,
      completedDate: project.completedDate,
    };
  });

  if (source === StorageSources.LOCAL) {
    getLogger().info(`exporting csv to ${path}`);
    mkdirSync(path, { recursive: true });
    const csv = Papa.unparse(projectToExport);
    await writeFileSync(`${path}/project-list.csv`, csv, { encoding: 'utf-8' });
  } else {
    getLogger().error(`currently we only support export to local file, exiting script...`);
    return;
  }

  getLogger().info('exiting script...');
}
