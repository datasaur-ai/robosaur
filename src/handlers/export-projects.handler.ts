import { getConfig, setConfigByJSONFile } from '../config/config';
import { getProjectExportValidators } from '../config/schema/validator';
import { exportProject } from '../datasaur/export-project';
import { JobStatus } from '../datasaur/get-jobs';
import { getProjects } from '../datasaur/get-projects';
import { getLogger } from '../logger';
import { pollJobsUntilCompleted } from '../utils/polling.helper';
import { publishProjectFiles } from '../utils/publish/publishProjectFiles';
import { publishZipFile } from '../utils/publish/publishZipFile';
import { getState } from '../utils/states/getStates';
import { ProjectState } from '../utils/states/interfaces';
import { isExportedStatusLower } from '../utils/states/isExportedStatusLower';
import { ScriptAction } from './constants';

export async function handleExportProjects(configFile: string, { unzip }: { unzip: boolean }) {
  setConfigByJSONFile(configFile, getProjectExportValidators(), ScriptAction.PROJECT_EXPORT);

  const scriptState = await getState();
  await scriptState.updateInProgressProjectCreationStates();

  const {
    statusFilter,
    teamId,
    format: exportFormat,
    customScriptId: exportCustomScriptId,
    source,
  } = getConfig().export;

  // retrieves projects from Datasaur matching the status filters
  // add or update the projects in script state
  getLogger().info('retrieving projects with filters', { filter: statusFilter });
  const validProjectsFromDatasaur = await getProjects({ statuses: statusFilter, teamId });
  scriptState.addProjectsToExport(validProjectsFromDatasaur);

  // from script state, retrieves all projects that are eligible for export
  const projectToExports = Array.from(scriptState.getTeamProjectsState().getProjects()).filter(
    ([_name, projectState]) => {
      if (statusFilter.includes(projectState.projectStatus)) {
        return shouldExport(projectState);
      }
      return false;
    },
  );
  if (projectToExports.length === 0) {
    getLogger().info(`no projects left to export, exiting script...`);
    return;
  }
  getLogger().info(`found ${projectToExports.length} projects to export`);

  const results: Array<{ projectName: string; exportId: string; jobStatus: JobStatus | 'PUBLISHED' }> = [];
  for (const [_key, [name, project]] of projectToExports.entries()) {
    const temp = {
      projectName: project.projectName,
      jobStatus: project.export?.jobStatus ?? JobStatus.NONE,
      exportId: project.export?.jobId ?? '',
    };

    getLogger().info('submitting export job to Datasaur...', {
      project: {
        id: project.projectId,
        name: project.projectName,
        format: exportFormat,
        customScriptId: exportCustomScriptId,
      },
    });
    const retval = await exportProject(project.projectId as string, name, exportFormat, exportCustomScriptId);
    temp.exportId = retval.exportId;
    temp.jobStatus = retval.queued ? JobStatus.QUEUED : JobStatus.IN_PROGRESS;

    scriptState.updateStateByProjectName(project.projectName, {
      export: {
        jobId: temp.exportId,
        jobStatus: temp.jobStatus,
        statusOnLastExport: project.projectStatus,
      },
    });

    const jobResult = (await pollJobsUntilCompleted([retval.exportId]))[0];
    getLogger().info(`export job finished`, { ...jobResult });
    temp.jobStatus = jobResult.status;
    scriptState.updateStatesFromProjectExportJobs([jobResult]);
    await scriptState.save();

    try {
      if (unzip) {
        await publishProjectFiles(retval.fileUrl, `${project.projectName}`);
      } else {
        await publishZipFile(retval.fileUrl, `${project.projectName}`);
      }
      scriptState.updateStatesFromProjectExportJobs([{ ...jobResult, status: 'PUBLISHED' as JobStatus }]);
      temp.jobStatus = 'PUBLISHED';
    } catch (error) {
      getLogger().error(`fail to publish exported project to ${source}`, {
        error: { ...error, message: error.message },
      });
      scriptState.updateStatesFromProjectExportJobs([{ ...jobResult, status: JobStatus.FAILED as JobStatus }]);
    }
    await scriptState.save();
    results.push(temp);
  }

  const exportOK = results.filter((r) => r.jobStatus === 'PUBLISHED' || r.jobStatus === JobStatus.DELIVERED);
  const exportFail = results.filter((r) => !(r.jobStatus === 'PUBLISHED' || r.jobStatus === JobStatus.DELIVERED));
  getLogger().info(
    `completed ${results.length} export jobs; ${exportOK.length}} successful and ${exportFail.length} failed`,
    {
      success: exportOK,
      fail: exportFail,
    },
  );
  await scriptState.save();
  getLogger().info('exiting script...');
}

function shouldExport(state: ProjectState) {
  if (!state.export || state.export.jobStatus !== 'PUBLISHED' || isExportedStatusLower(state)) {
    return true;
  }

  return false;
}
