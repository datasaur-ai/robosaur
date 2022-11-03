import { getTeamTags } from '../../datasaur/get-team-tags';
import { ProjectState } from '../../utils/states/interfaces';
import { isExportedStatusLower } from '../../utils/states/isExportedStatusLower';

export async function getTagIds(teamId: string, tagsName: string[]) {
  if (tagsName.length === 0) return undefined;
  const tags = await getTeamTags(teamId);

  return tagsName.map((tagName) => {
    const tag = tags.find((tag) => tag.name === tagName);
    if (tag === undefined) {
      throw new Error(`Tag ${tagName} is not found.`);
    }
    return tag.id;
  });
}

export function shouldExport(state: ProjectState) {
  if (!state.export || state.export.jobStatus !== 'PUBLISHED' || isExportedStatusLower(state)) {
    return true;
  }
  return false;
}
