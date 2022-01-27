import { getConfig, setConfigByJSONFile } from '../config/config';
import { getProjectExportValidators } from '../config/schema/validator';
import { exportProject } from '../datasaur/export-project';
import { getProjects } from '../datasaur/get-projects';
import { isExportedStatusLower } from '../utils/states/isExportedStatusLower';
import { getState } from '../utils/states/getStates';
import { ProjectState } from '../utils/states/interfaces';
import { ScriptAction } from './constants';

export async function handleExportProjects(configFile: string) {
  // set config
  setConfigByJSONFile(configFile, getProjectExportValidators(), ScriptAction.PROJECT_EXPORT);

  const scriptState = await getState();
  await scriptState.updateInProgressProjectCreationStates();

  // get export filter
  const { statusFilter, teamId, format: exportFormat, customScriptId: exportCustomScriptId } = getConfig().export;
  const validProjectsFromDatasaur = await getProjects({ statuses: 'CREATED', teamId });

  scriptState.addProjectsToExport(validProjectsFromDatasaur);

  const projectToExports = Array.from(scriptState.getTeamProjectsState().getProjects()).filter(
    ([_name, projectState]) => {
      if (projectState.projectStatus in statusFilter) {
        return shouldExport(projectState);
      }
      return false;
    },
  );

  const results: any[] = [];
  for (const [name, project] of projectToExports) {
    const retval = await exportProject(project.projectId, name, exportFormat, exportCustomScriptId);
    results.push(retval);

    console.log(retval);
    return;
  }
  // // wait
  //  // upload to destined bucket
  // update state along the way
  // summarize what the script did in this run (success/fail count)
}

function shouldExport(state: ProjectState) {
  if (
    !state.export ||
    state.export.jobStatus !== 'PUBLISHED' ||
    isExportedStatusLower(state) ||
    new Date(state.export.exportedFileUrlExpiredAt).getTime() <= Date.now()
  ) {
    return true;
  }

  return false;
}
