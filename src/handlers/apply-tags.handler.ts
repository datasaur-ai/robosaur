import * as Papa from 'papaparse';

import { getConfig, setConfigByJSONFile } from '../config/config';
import { ApplyTagsConfig, StorageSources } from '../config/interfaces';
import { getApplyTagValidators } from '../config/schema/validator';
import { ScriptAction } from './constants';
import { createTags } from '../datasaur/create-tag';
import { getProject } from '../datasaur/get-project';
import { getTeamTags } from '../datasaur/get-team-tags';
import { updateProjectTag } from '../datasaur/update-project-tag';
import { Tag } from '../generated/graphql';
import { getLogger } from '../logger';
import { getStorageClient } from '../utils/object-storage';
import { defaultCSVConfig, readCSVFile } from '../utils/readCSVFile';
import { sleep } from '../utils/sleep';

interface ApplyTagsOption {
  method: 'PUT' | 'PATCH';
}

export async function handleApplyTags(configFile: string, option: ApplyTagsOption) {
  setConfigByJSONFile(configFile, getApplyTagValidators(), ScriptAction.APPLY_TAGS);

  const config = getConfig().applyTags;
  const applyTagPayload = await getApplyTagPayload(config);
  const tagsToApplyList = getTagsList(applyTagPayload);
  getLogger().info('Reading apply-tag payload...');

  const teamTagNames = (await getTeamTags(config.teamId)).map((tag) => tag.name);
  getLogger().info('Retrieving existing tags...');

  await createNonExistingTags(tagsToApplyList, teamTagNames, config);
  const tagMap = (await getTeamTags(config.teamId)).reduce((result, tag) => {
    result.set(tag.name, tag);
    return result;
  }, new Map<string, Tag>());

  let requestCount = 0;
  for (const payload of applyTagPayload) {
    const project = await getProject(payload.projectId);
    requestCount = await rest(requestCount);

    const tagIds =
      option.method === 'PUT'
        ? project?.tags?.filter((tag) => tag.globalTag).map((tag) => tag.id)
        : project?.tags?.map((tag) => tag.id);
    const projectTag = payload.tags.split(',');
    projectTag.forEach((tag) => {
      // skip empty string
      if (tag) {
        tagIds?.push(tagMap.get(tag)!.id);
      }
    });

    getLogger().info(`Applying tags to project ${payload.projectId}`);
    await updateProjectTag(payload.projectId, tagIds);
    getLogger().info(`Successfully tag project ${payload.projectId}`);
    requestCount = await rest(requestCount);
  }
}

async function getApplyTagPayload(config: ApplyTagsConfig) {
  const IMPLEMENTED_SOURCES = [
    StorageSources.INLINE,
    StorageSources.LOCAL,
    StorageSources.AMAZONS3,
    StorageSources.GOOGLE,
    StorageSources.AZURE,
  ];

  switch (config.source) {
    case StorageSources.INLINE:
      return config.payload.map((project) => {
        return {
          projectId: project.projectId,
          tags: project.tags.toString(),
        };
      });
    case StorageSources.LOCAL:
      return readCSVFile(config.path, 'utf-8', {
        header: true,
        skipEmptyLines: true,
      }).data;
    case StorageSources.AMAZONS3:
    case StorageSources.AZURE:
    case StorageSources.GOOGLE:
      const csvFromCloud = await getStorageClient(config.source).getStringFileContent(config.bucketName, config.path);
      return Papa.parse(csvFromCloud, { ...defaultCSVConfig, header: true, skipEmptyLines: true }).data;
    default:
      throw new Error(
        `${config.source} is not implemented for this command. Please use one of ${JSON.stringify(
          IMPLEMENTED_SOURCES,
        )}`,
      );
  }
}

function getTagsList(configPayload) {
  let tagsList: string[] = [];
  configPayload.forEach((project: { tags: string }) => {
    if (project.tags.includes(',')) {
      const splitTags = project.tags.split(',');
      splitTags.forEach((tag: string) => {
        if (!tagsList.includes(tag)) tagsList.push(tag);
      });
    } else {
      if (!tagsList.includes(project.tags)) tagsList.push(project.tags);
    }
  });
  return tagsList;
}

async function createNonExistingTags(tagTargets, tagList, config) {
  let requestCount = 0;
  for (const tag of tagTargets) {
    if (!tagList.includes(tag)) {
      getLogger().info(`Tag ${tag} not found! Creating tag in project...`);
      await createTags(config.teamId, tag);
      requestCount = await rest(requestCount);
    }
  }
}

async function rest(requestCount: number): Promise<number> {
  const BATCH_COUNT = 10;
  if (requestCount > BATCH_COUNT) {
    getLogger().info(`Resolving requests...`);
    await sleep(1000);
    return 0;
  }
  return requestCount + 1;
}
