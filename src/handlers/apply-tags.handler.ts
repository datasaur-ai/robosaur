import * as Papa from 'papaparse';

import { getConfig, setConfigByJSONFile } from '../config/config';
import { ApplyTagsConfig, StorageSources } from '../config/interfaces';
import { getApplyTagValidators } from '../config/schema/validator';
import { ScriptAction } from './constants';
import { createTags } from '../datasaur/create-tag';
import { getProject } from '../datasaur/get-project';
import { getTeamTags } from '../datasaur/get-team-tags';
import { updateProjectTag } from '../datasaur/update-project-tag';
import { getLogger } from '../logger';
import { getStorageClient } from '../utils/object-storage';
import { defaultCSVConfig, readCSVFile } from '../utils/readCSVFile';
import { Project, Tag } from '../generated/graphql';

interface ApplyTagsOption {
  method: 'PUT' | 'PATCH';
}

export async function handleApplyTags(configFile: string, option: ApplyTagsOption) {
  setConfigByJSONFile(configFile, getApplyTagValidators(), ScriptAction.APPLY_TAGS);

  const config = getConfig().applyTags;
  const applyTagPayload = await getApplyTagPayload(config);
  const tagsToApplyList = getTagsList(applyTagPayload);
  getLogger().info('Reading apply-tag payload...');

  const teamTagsList = await getTeamTags(config.teamId);

  const teamTagNames = teamTagsList.map((tag) => tag.name);
  getLogger().info('Retrieving existing tags...');

  await createNonExistingTags(tagsToApplyList, teamTagNames, config);
  const tagMap = (await getTeamTags(config.teamId)).reduce((result, tag) => {
    result.set(tag.name, tag);
    return result;
  }, new Map<string, Tag>());

  const projectMap = new Map<string, Project>();
  for (const project of applyTagPayload) {
    projectMap.set(project.projectId, await getProject(project.projectId));
  }

  const projects = applyTagPayload.map((payload) => {
    const project = projectMap.get(payload.projectId);
    const tagIds =
      option.method === 'PUT'
        ? project?.tags?.filter((tag) => tag.globalTag).map((tag) => tag.id)
        : project?.tags?.map((tag) => tag.id);
    getLogger().info(`Applying tags to project ${payload.projectId}`);

    const projectTag = payload.tags.split(',');
    projectTag.forEach((tag) => {
      // skip empty string
      if (tag) {
        tagIds?.push(tagMap.get(tag)!.id);
      }
    });

    return { projectId: project?.id, tags: [...new Set(tagIds)] };
  });

  for (const project of projects) {
    await updateProjectTag(project.projectId, project.tags);
    getLogger().info(`Successfully tag project ${project.projectId}`);
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
      }).data;
    case StorageSources.AMAZONS3:
    case StorageSources.AZURE:
    case StorageSources.GOOGLE:
      const csvFromCloud = await getStorageClient(config.source).getStringFileContent(config.bucketName, config.path);
      return Papa.parse(csvFromCloud, { ...defaultCSVConfig, header: true }).data;
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
  configPayload.forEach((project) => {
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
  for (const tag of tagTargets) {
    if (!tagList.includes(tag)) {
      getLogger().info(`Tag ${tag} not found! Creating tag in project...`);
      await createTags(config.teamId, tag);
    }
  }
}
