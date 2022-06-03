import { getConfig, setConfigByJSONFile } from "../config/config";
import { ApplyTagsConfig, ProjectTags, StorageSources } from "../config/interfaces";
import { getApplyTagValidators } from "../config/schema/validator";
import { createTags } from "../datasaur/create-tag";
import { getTeamTags } from "../datasaur/get-team-tags";
import { getProject } from "../datasaur/get-project"
import { readCSVFile } from "../utils/readCSVFile";
import { ScriptAction } from "./constants";
import { updateProjectTag } from "../datasaur/update-project-tag";

export async function handleApplyTags(configFile: string) {
  setConfigByJSONFile(configFile, getApplyTagValidators(), ScriptAction.APPLY_TAGS)

  const config = getConfig().applyTags;
  const applyTagPayload: ProjectTags[] = getApplyTagPayload(config)
  console.log(applyTagPayload);

  const tagsToApplyList = getTagsList(applyTagPayload)
  console.log(tagsToApplyList)

  const teamTagsList = await getTeamTags(config.teamId)
  const teamTagsNames = teamTagsList.map((tag) => {
    return tag.name;
  })

  await createNonexistingTags(tagsToApplyList,teamTagsNames,config)

  const projects: Promise<{ projectId: any; tags: any; }>[] = applyTagPayload.map(async payload => {
    const project = await getProject(payload.projectId)
    // console.log(project)

    const projectTag = payload.tags
    projectTag?.forEach(tag => {
      project.tags.push(teamTagsList.find((tagItem)=>tagItem.name === tag))
    });

    const tagIds = project.tags.map((tag)=>{
      return tag.id
    })

    console.log({projectId:project.id, tags: [...new Set(tagIds)]})
    return {projectId:project.id, tags: [...new Set(tagIds)]}
  });

  projects.forEach(async (project)=>{
    updateProjectTag((await project).projectId, (await project).tags)
  })
}

function getApplyTagPayload(config: ApplyTagsConfig) {
  switch (config.source){
    case StorageSources.INLINE:
      return config.payload;
    case StorageSources.LOCAL:
      return readPayloadCsv(config.path);
    default:
      return [{projectId:"no payload", tags: []}];
  }
}

function readPayloadCsv(path: string) {
  let payloadFromCsv: ProjectTags[] = [];
  const csvData = readCSVFile(path, "utf-8").data.slice(1);

  csvData.forEach((data) => {
    if (payloadFromCsv.filter(payload => payload.projectId === data[1]).length === 0) {
      const properFormat: ProjectTags = {
        projectId: data[1],
        tags: [data[0]]
      }
      payloadFromCsv.push(properFormat);
    } else {
      payloadFromCsv = payloadFromCsv.map((payload) => {
        if(payload.projectId===data[1]){
          payload.tags = [...payload.tags, data[0]]
        }

        return payload;
      })
    }
  })

  return payloadFromCsv;
}

function getTagsList(configPayload) {
  let tags: string[] = []
  configPayload.forEach((project)=> {
    project.tags.forEach((tag: string) => {
      if (!tags.includes(tag)) tags.push(tag)
    });
  })

  return tags
}

async function createNonexistingTags(tagTargets, tagList, config){
   tagTargets.forEach(async tag => {
    if (!tagList.includes(tag)){
      //create tag
      console.log("creating tag", tag)
      await createTags(config.teamId, tag);
    }
  })
}