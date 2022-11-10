import { getConfig, setConfigByJSONFile } from '../config/config';
import { StateConfig } from '../config/interfaces';
import { getProjectExportValidators } from '../config/schema/validator';
import { deleteProject } from '../datasaur/delete-project';
import { exportProject } from '../datasaur/export-project';
import { JobStatus } from '../datasaur/get-jobs';
import { getProjects } from '../datasaur/get-projects';
import { ExportResult, Project } from '../datasaur/interfaces';
import { createSimpleHandlerContext } from '../execution';
import { getLogger } from '../logger';
import { pollJobsUntilCompleted } from '../utils/polling.helper';
import { publishProjectFiles } from '../utils/publish/publishProjectFiles';
import { publishZipFile } from '../utils/publish/publishZipFile';
import { getState } from '../utils/states/getStates';
import { ProjectState } from '../utils/states/interfaces';
import { ScriptState } from '../utils/states/script-state';
import { ScriptAction } from './constants';
import { DeleteProjectError } from './error/delete-project-error';
import { ExportProjectError } from './error/export-project-error';
import { getTagIds, shouldExport } from './export/helper';

interface ProjectExportOption {
  unzip: boolean;
  deleteProjectAfterExport: boolean;
}

interface ExportStatusObject {
  projectName: string;
  jobStatus: JobStatus | 'PUBLISHED';
  exportId: string;
}

const handleStateless = async (unzip: boolean) => {
  const { source } = getConfig().export;

  const projectsToExport = await filterProjectsToExport();

  getLogger().info(`found ${projectsToExport.length} projects to export`);

  getLogger().info(projectsToExport.map((project) => project.name + '_' + project.id));

  const results: Array<{ projectName: string; exportId: string; jobStatus: JobStatus | 'PUBLISHED' }> = [];
  for (const project of projectsToExport) {
    const filename = `${project.name}_${project.id}`;
    const temp: ExportStatusObject = {
      projectName: filename,
      jobStatus: JobStatus.NONE,
      exportId: '',
    };

    const retval = await submitProjectExportJob(project.id, filename);
    temp.exportId = retval.exportId;
    temp.jobStatus = retval.queued ? JobStatus.QUEUED : JobStatus.IN_PROGRESS;

    const jobResult = (await pollJobsUntilCompleted([retval.exportId]))[0];
    getLogger().info(`export job finished`, { ...jobResult });
    temp.jobStatus = jobResult?.status;

    try {
      if (unzip) {
        await publishProjectFiles(retval.fileUrl, `${filename}`);
      } else {
        await publishZipFile(retval.fileUrl, `${filename}`);
      }
      temp.jobStatus = 'PUBLISHED';
    } catch (error) {
      getLogger().error(`fail to publish exported project to ${source}`, {
        error: JSON.stringify(error),
        message: error.message,
      });
    }
    results.push(temp);
  }

  await checkProjectExportJobs(results);
};

export const handleExportProjects = createSimpleHandlerContext('export-projects', _handleExportProjects);

async function _handleExportProjects(
  configFile: string,
  options: ProjectExportOption,
  errorCallback?: (error: Error) => Promise<void>,
) {
  const { unzip, deleteProjectAfterExport } = options;

  if (!errorCallback) {
    setConfigByJSONFile(configFile, getProjectExportValidators(), ScriptAction.PROJECT_EXPORT);
  }

  const stateless = getConfig().export.executionMode === StateConfig.STATELESS;

  if (stateless) {
    getLogger().info('executing stateless export using filter from config');
    return handleStateless(unzip);
  }

  getLogger().info('executing stateful export using filter from config');
  const scriptState = await getState();
  await scriptState.updateInProgressProjectCreationStates();

  const validProjectsFromDatasaur = await filterProjectsToExport();
  scriptState.addProjectsToExport(validProjectsFromDatasaur);

  const projectsToExport: [string, ProjectState][] = await getProjectsToExport(validProjectsFromDatasaur, scriptState);
  if (projectsToExport.length === 0) {
    getLogger().info(`no projects left to export, exiting script...`);
    return;
  }
  getLogger().info(`found ${projectsToExport.length} projects to export`);

  const results = await runProjectExport(projectsToExport, unzip, scriptState, errorCallback);
  const successResults = await checkProjectExportJobs(results);
  await scriptState.save();

  const successProjectNames = successResults.map((exportResult) => exportResult.projectName);

  if (deleteProjectAfterExport) {
    const projectsToDelete = Array.from(scriptState.getTeamProjectsState().getProjects()).filter(
      ([_name, projectState]) => {
        if (successProjectNames.includes(projectState.projectName)) {
          return true;
        }
        return false;
      },
    );

    for (const [name, projectState] of projectsToDelete) {
      getLogger().info(`deleting project ${name} with id ${projectState.projectId}...`);
      try {
        await deleteProject(projectState.projectId!);
        getLogger().info(`project ${projectState.projectId} has been deleted`);
      } catch (error) {
        getLogger().error(`delete project failed`, {
          error: JSON.stringify(error),
          message: error.message,
          stack: error?.stack,
        });
        if (errorCallback) {
          errorCallback(new DeleteProjectError(error));
        }
      }
    }
  }
}

async function filterProjectsToExport() {
  const { projectFilter, teamId, statusFilter } = getConfig().export;

  const filterTagIds = projectFilter && projectFilter.tags ? await getTagIds(teamId, projectFilter.tags) : undefined;

  // retrieves projects from Datasaur matching the status filters
  const filter = {
    statuses: statusFilter,
    teamId,
    kinds: projectFilter?.kind ? [projectFilter?.kind] : [],
    daysCreatedRange: projectFilter?.date
      ? {
          newestDate: projectFilter.date.newestDate,
          oldestDate: projectFilter.date?.oldestDate,
        }
      : undefined,
    tags: filterTagIds,
  };
  getLogger().info('retrieving projects with filters', { filter });
  return await getProjects(filter);
}

async function getProjectsToExport(validProjectsFromDatasaur: Project[], scriptState: ScriptState) {
  const { statusFilter } = getConfig().export;

  // from script state, retrieves all projects that are eligible for export
  const validProjectNamesFromDatasaur = validProjectsFromDatasaur.map((p) => p.name);
  const projectsToExport = Array.from(scriptState.getTeamProjectsState().getProjects()).filter(
    ([_name, projectState]) => {
      if (
        statusFilter.includes(projectState.projectStatus) &&
        validProjectNamesFromDatasaur.includes(projectState.projectName)
      ) {
        return shouldExport(projectState);
      }
      // special case: if export.statusFilter set to [],
      // match datasaur.ai getProjects behavior
      // return all projects
      if (statusFilter.length === 0) {
        return true;
      }
      return false;
    },
  );
  return projectsToExport;
}

async function runProjectExport(
  projectsToExport: [string, ProjectState][],
  unzip: boolean,
  scriptState: ScriptState,
  errorCallback?: (error: Error) => Promise<void>,
) {
  const { source } = getConfig().export;

  const results: Array<{ projectName: string; exportId: string; jobStatus: JobStatus | 'PUBLISHED' }> = [];
  for (const [name, project] of projectsToExport) {
    const temp: ExportStatusObject = {
      projectName: project.projectName,
      jobStatus: project.export?.jobStatus ?? JobStatus.NONE,
      exportId: project.export?.jobId ?? '',
    };

    const retval = await submitProjectExportJob(project.projectId!, name);
    temp.exportId = retval.exportId;
    temp.jobStatus = retval.queued ? JobStatus.QUEUED : JobStatus.IN_PROGRESS;

    scriptState.updateStateByProjectName(project.projectName, {
      export: {
        jobId: temp.exportId,
        jobStatus: temp.jobStatus,
        statusOnLastExport: project.projectStatus,
        exportedFileUrl: retval.fileUrl,
        exportedFileUrlExpiredAt: retval.fileUrlExpiredAt,
      },
    });

    const jobResult = (await pollJobsUntilCompleted([retval.exportId]))[0];
    getLogger().info(`export job finished`, { ...jobResult });
    temp.jobStatus = jobResult?.status;
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
        error: JSON.stringify(error),
        message: error.message,
      });
      if (errorCallback) {
        errorCallback(new ExportProjectError(error));
      }
      scriptState.updateStatesFromProjectExportJobs([{ ...jobResult, status: JobStatus.FAILED as JobStatus }]);
    }
    await scriptState.save();
    results.push(temp);
  }

  return results;
}

async function submitProjectExportJob(projectId: string, name: string) {
  const { format: exportFormat, fileTransformerId: exportFileTransformerId } = getConfig().export;

  getLogger().info('submitting export job to Datasaur...', {
    create: {
      id: projectId,
      name: name,
      format: exportFormat,
      fileTransformerId: exportFileTransformerId,
    },
  });
  let retval: ExportResult | null = null;
  try {
    retval = await exportProject(projectId, name, exportFormat, exportFileTransformerId);
  } catch (error) {
    retval = {
      exportId: 'dummyexport',
      fileUrl: 'dummyfile',
    } as ExportResult;
    getLogger().error(`fail in exportProject query`, { error: JSON.stringify(error), message: error.message });
  }

  return retval;
}

async function checkProjectExportJobs(results: ExportStatusObject[]) {
  const exportOK = results.filter((r) => r.jobStatus === 'PUBLISHED' || r.jobStatus === JobStatus.DELIVERED);
  const exportFail = results.filter((r) => !(r.jobStatus === 'PUBLISHED' || r.jobStatus === JobStatus.DELIVERED));
  getLogger().info(
    `completed ${results.length} export jobs; ${exportOK.length} successful and ${exportFail.length} failed`,
    {
      success: exportOK,
      fail: exportFail,
    },
  );
  getLogger().info('exiting script...');

  return exportOK;
}
