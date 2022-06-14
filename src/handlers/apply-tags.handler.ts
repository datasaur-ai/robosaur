import { getConfig, setConfigByJSONFile } from '../config/config';
import { ApplyTagsConfig, StorageSources } from '../config/interfaces';
import { getApplyTagValidators } from '../config/schema/validator';
import { ScriptAction } from './constants';
import { createTags } from '../datasaur/create-tag';
import { getProject } from '../datasaur/get-project';
import { getTeamTags } from '../datasaur/get-team-tags';
import { Project } from '../datasaur/interfaces';
import { updateProjectTag } from '../datasaur/update-project-tag';
import { getLogger } from '../logger';
import { getStorageClient } from '../utils/object-storage';
import { defaultCSVConfig, readCSVFile } from '../utils/readCSVFile';
import * as Papa from 'papaparse';
import { sleep } from '../utils/sleep';

const BATCH_COUNT = 20;

export async function handleApplyTags(configFile: string) {
  setConfigByJSONFile(configFile, getApplyTagValidators(), ScriptAction.APPLY_TAGS);

  const config = getConfig().applyTags;
  const applyTagPayload = await getApplyTagPayload(config);
  const tagsToApplyList = getTagsList(applyTagPayload);
  getLogger().info('Reading apply-tag payload...');

  const teamTagsList = await getTeamTags(config.teamId);
  const teamTagsNames = teamTagsList.map((tag) => {
    return tag.name;
  });
  getLogger().info('Retrieving existing tags...');

  await createNonExistingTags(tagsToApplyList, teamTagsNames, config);

  let projectsList: Project[] = [];
  let request_count = 0;
  for (const project of applyTagPayload) {
    getLogger().info(`Retrieving project ${project.projectId}...`);
    projectsList.push(await getProject(project.projectId));
    if (request_count > BATCH_COUNT) {
      getLogger().info(`Resolving requests...`);
      await sleep(3000);
      request_count = 0;
    } else {
      request_count += 1;
    }
  }

  const tagList = await getTeamTags(config.teamId);
  for (const payload of applyTagPayload) {
    const project = projectsList.find((item) => item.id === payload.projectId);
    getLogger().info(`Applying tags to project ${payload.projectId}`);

    const projectTag = payload.tags.split(',');
    projectTag.forEach((tag) => {
      project?.tags.push(tagList.find((tagItem) => tagItem.name === tag));
    });

    const tagIds = project?.tags.map((tag) => {
      return tag.id;
    });

    updateProjectTag(project?.id, [...new Set(tagIds)]);
    getLogger().info('Tagging success!');
    if (request_count > BATCH_COUNT) {
      getLogger().info(`Resolving requests...`);
      await sleep(3000);
      request_count = 0;
    } else {
      request_count += 1;
    }
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
  for (const tag of tagTargets) {
    if (!tagList.includes(tag)) {
      getLogger().info(`Tag ${tag} not found! Creating tag in project...`);
      await createTags(config.teamId, tag);
    }
  }
}
