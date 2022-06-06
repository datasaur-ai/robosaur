import { getConfig, setConfigByJSONFile } from '../config/config';
import { ApplyTagsConfig, ProjectTags, StorageSources } from '../config/interfaces';
import { getApplyTagValidators } from '../config/schema/validator';
import { ScriptAction } from './constants';
import { createTags } from '../datasaur/create-tag';
import { getProject } from '../datasaur/get-project';
import { getTeamTags } from '../datasaur/get-team-tags';
import { updateProjectTag } from '../datasaur/update-project-tag';
import { getLogger } from '../logger';
import { getStorageClient } from '../utils/object-storage';
import { defaultCSVConfig, readCSVFile } from '../utils/readCSVFile';
import * as Papa from 'papaparse';
import { Project } from '../datasaur/interfaces';

export async function handleApplyTags(configFile: string) {
  setConfigByJSONFile(configFile, getApplyTagValidators(), ScriptAction.APPLY_TAGS);

  const config = getConfig().applyTags;
  const applyTagPayload: ProjectTags[] = await getApplyTagPayload(config);
  const tagsToApplyList = getTagsList(applyTagPayload);
  getLogger().info('Reading apply-tag payload...');

  const teamTagsList = await getTeamTags(config.teamId);
  const teamTagsNames = teamTagsList.map((tag) => {
    return tag.name;
  });
  getLogger().info('Retrieving existing tags...');

  await createNonExistingTags(tagsToApplyList, teamTagsNames, config);
  const tagList = await getTeamTags(config.teamId);

  let projectsList: Project[] = [];
  for (const project of applyTagPayload) {
    projectsList.push(await getProject(project.projectId));
  }

  const projects = applyTagPayload.map((payload) => {
    const project = projectsList.find((item) => item.id === payload.projectId);
    getLogger().info(`Applying tags to project ${payload.projectId}`);

    const projectTag = payload.tags;
    projectTag?.forEach((tag) => {
      project?.tags.push(tagList.find((tagItem) => tagItem.name === tag));
    });

    const tagIds = project?.tags.map((tag) => {
      return tag.id;
    });

    return { projectId: project?.id, tags: [...new Set(tagIds)] };
  });

  projects.forEach((project) => {
    updateProjectTag(project.projectId, project.tags);
    getLogger().info('Tagging success!');
  });
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
      return config.payload;
    case StorageSources.LOCAL:
      const csvData = readCSVFile(config.path, 'utf-8').data.slice(1);
      return readPayloadCsv(csvData);
    case StorageSources.AMAZONS3:
    case StorageSources.AZURE:
    case StorageSources.GOOGLE:
      const csvFromCloud = await getStorageClient(config.source).getStringFileContent(config.bucketName, config.path);
      const parsedCsvFromCloud = Papa.parse(csvFromCloud, defaultCSVConfig).data.slice(1);
      return readPayloadCsv(parsedCsvFromCloud);
    default:
      throw new Error(
        `${config.source} is not implemented for this command. Please use one of ${JSON.stringify(
          IMPLEMENTED_SOURCES,
        )}`,
      );
  }
}

function readPayloadCsv(path) {
  let payloadFromCsv: ProjectTags[] = [];

  path.forEach((data: string[]) => {
    if (payloadFromCsv.filter((payload) => payload.projectId === data[1]).length === 0) {
      const properFormat: ProjectTags = {
        projectId: data[1],
        tags: [data[0]],
      };
      payloadFromCsv.push(properFormat);
    } else {
      payloadFromCsv = payloadFromCsv.map((payload) => {
        if (payload.projectId === data[1]) {
          payload.tags = [...payload.tags, data[0]];
        }

        return payload;
      });
    }
  });

  return payloadFromCsv;
}

function getTagsList(configPayload) {
  let tags: string[] = [];
  configPayload.forEach((project) => {
    project.tags.forEach((tag: string) => {
      if (!tags.includes(tag)) tags.push(tag);
    });
  });

  return tags;
}

async function createNonExistingTags(tagTargets, tagList, config) {
  for (const tag of tagTargets) {
    if (!tagList.includes(tag)) {
      getLogger().info(`Tag ${tag} not found! Creating tag in project...`);
      await createTags(config.teamId, tag);
    }
  }
}
