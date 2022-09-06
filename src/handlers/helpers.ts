import { createTags } from '../datasaur/create-tag';
import { getTeamTags } from '../datasaur/get-team-tags';
import { Project } from '../datasaur/interfaces';
import { updateProjectTag } from '../datasaur/update-project-tag';

export function getProjectsToExport(projects: Project[], exportedTag?: string): Project[] {
  if (exportedTag) {
    return projects.filter((project) => !project.tags.some((tag) => tag.name === exportedTag));
  } else {
    return projects;
  }
}

export async function getExportedTagId(teamId, exportedTag?: string): Promise<string | undefined> {
  if (!exportedTag) {
    return undefined;
  }
  const tags = await getTeamTags(teamId);
  const tag = tags.find((t) => t.name === exportedTag);
  if (tag) {
    return tag.id;
  } else {
    const createdTag = await createTags(teamId, exportedTag);
    return createdTag.id;
  }
}

export async function getTagIds(teamId: string, tagsName: string[]) {
  if (tagsName.length === 0) return undefined;
  const tags = await getTeamTags(teamId);

  return tagsName.map((tagName) => {
    const tag = tags.find((tagItem) => tagItem.name === tagName);
    if (tag === undefined) {
      throw new Error(`Tag ${tagName} is not found.`);
    }
    return tag.id;
  });
}

export async function applyExportedTag(project: Project, tagId?: string) {
  if (tagId) {
    const tagIds = new Set(project.tags.map((tag) => tag.id));
    tagIds.add(tagId);
    await updateProjectTag(project.id, Array.from(tagIds));
  }
}
