import { getConfig, setConfigByJSONFile } from '../config/config';
import { getProjectExportValidators } from '../config/schema/validator';
import { getProjects } from '../datasaur/get-projects';
import { getTeamTags } from '../datasaur/get-team-tags';
import { getLogger } from '../logger';
import { writeCSVFile } from '../utils/readCSVFile';
import { ScriptAction } from './constants';

export async function handleExportProjectOverview(configFile: string) {
  setConfigByJSONFile(configFile, getProjectExportValidators(), ScriptAction.NONE);

  const { teamId, filename, projectFilter } = getConfig().exportProjectOverview;

  // retrieves projects from Datasaur matching the filters
  getLogger().info('retrieving projects with filters', { filter: projectFilter });
  const tagIds = projectFilter?.tags ? await getTagIds(teamId, projectFilter.tags) : undefined;
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

  await writeCSVFile(projectToExport, filename);

  getLogger().info('exiting script...');
}

async function getTagIds(teamId: string, tagsName: string[]) {
  if (tagsName.length === 0) return;

  const tags = await getTeamTags(teamId);

  return tagsName.map((tagName) => {
    const tag = tags.find((tag) => tag.name === tagName);
    if (tag === undefined) {
      throw new Error(`Tag ${tagName} is not found.`);
    }
    return tag.id;
  });
}
