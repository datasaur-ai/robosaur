import { getTeamTags } from '../../datasaur/get-team-tags';

export async function convertTagNamesToIds(teamId: string, tagsName: string[]) {
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
