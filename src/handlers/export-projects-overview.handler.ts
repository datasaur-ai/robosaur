import { getConfig, setConfigByJSONFile } from '../config/config';
import { getProjectOverviewExportValidators } from '../config/schema/validator';
import { getProjects } from '../datasaur/get-projects';
import { getLogger } from '../logger';
import { convertTagNamesToIds } from '../utils/tags/convertTagNamesToIds';
import { writeCSVFile } from '../utils/writeCSVFile';
import { ScriptAction } from './constants';

export async function handleExportProjectOverview(configFile: string) {
  setConfigByJSONFile(configFile, getProjectOverviewExportValidators(), ScriptAction.PROJECT_OVERVIEW_EXPORT);

  const { teamId, filename, projectFilter } = getConfig().exportProjectOverview;

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

  getLogger().info(`exporting csv to ${filename}`);
  await writeCSVFile(projectToExport, filename);

  getLogger().info('exiting script...');
}