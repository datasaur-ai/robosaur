import { getConfig, setConfigByJSONFile } from '../config/config';
import { StateConfig } from '../config/interfaces';
import { getProjectExportValidators } from '../config/schema/validator';
import { exportProject } from '../datasaur/export-project';
import { JobStatus } from '../datasaur/get-jobs';
import { getProjects } from '../datasaur/get-projects';
import { ExportResult } from '../datasaur/interfaces';
import { getLogger } from '../logger';
import { pollJobsUntilCompleted } from '../utils/polling.helper';
import { publishProjectFiles } from '../utils/publish/publishProjectFiles';
import { publishZipFile } from '../utils/publish/publishZipFile';
import { getState } from '../utils/states/getStates';
import { ProjectState } from '../utils/states/interfaces';
import { isExportedStatusLower } from '../utils/states/isExportedStatusLower';
import { ScriptAction } from './constants';

const handleStateless = async (unzip: boolean) => {
  const {
    statusFilter,
    teamId,
    format: exportFormat,
    fileTransformerId: exportFileTransformerId,
    source,
    projectFilter,
  } = getConfig().export;

  getLogger().info('retrieving projects with filters', { filter: statusFilter });
  const projectToExports = await getProjects({
    statuses: statusFilter,
    teamId,
    kinds: projectFilter?.kind ? [projectFilter?.kind] : [],
    daysCreatedRange: projectFilter?.date
      ? {
          newestDate: projectFilter.date.newestDate,
          oldestDate: projectFilter.date?.oldestDate,
        }
      : undefined,
  });

  getLogger().info(`found ${projectToExports.length} projects to export`);

  getLogger().info(projectToExports.map((project) => project.name + '_' + project.id));

  const results: Array<{ projectName: string; exportId: string; jobStatus: JobStatus | 'PUBLISHED' }> = [];
  for (const project of projectToExports) {
    const filename = `${project.name}_${project.id}`;
    const temp: {
      projectName: string;
      jobStatus: JobStatus | 'PUBLISHED';
      exportId: string;
    } = {
      projectName: filename,
      jobStatus: JobStatus.NONE,
      exportId: '',
    };

    getLogger().info('submitting export job to Datasaur...', {
      create: {
        id: project.id,
        name: filename,
        format: exportFormat,
        fileTransformerId: exportFileTransformerId,
      },
    });
    let retval: ExportResult | null = null;
    try {
      retval = await exportProject(project.id, filename, exportFormat, exportFileTransformerId);
    } catch (error) {
      retval = {
        exportId: 'dummyexport',
        fileUrl: 'dummyfile',
      } as ExportResult;
      getLogger().error(`fail in exportProject query`, { error: JSON.stringify(error), message: error.message });
    }
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
};

export async function handleExportProjects(configFile: string, { unzip }: { unzip: boolean }) {
  setConfigByJSONFile(configFile, getProjectExportValidators(), ScriptAction.PROJECT_EXPORT);

  const stateless = getConfig().export.executionMode === StateConfig.STATELESS;

  if (stateless) {
    getLogger().info('executing stateless export using filter from config');
    return handleStateless(unzip);
  }

  getLogger().info('executing stateful export using filter from config');
  const scriptState = await getState();
  await scriptState.updateInProgressProjectCreationStates();

  const {
    statusFilter,
    teamId,
    format: exportFormat,
    fileTransformerId: exportFileTransformerId,
    source,
    projectFilter,
  } = getConfig().export;

  // retrieves projects from Datasaur matching the status filters
  // add or update the projects in script state
  getLogger().info('retrieving projects with filters', { filter: statusFilter });
  const validProjectsFromDatasaur = await getProjects({
    statuses: statusFilter,
    teamId,
    kinds: projectFilter?.kind ? [projectFilter?.kind] : [],
    daysCreatedRange: projectFilter?.date
      ? {
          newestDate: projectFilter.date.newestDate,
          oldestDate: projectFilter.date?.oldestDate,
        }
      : undefined,
  });
  scriptState.addProjectsToExport(validProjectsFromDatasaur);

  // from script state, retrieves all projects that are eligible for export
  const projectToExports = Array.from(scriptState.getTeamProjectsState().getProjects()).filter(
    ([_name, projectState]) => {
      if (statusFilter.includes(projectState.projectStatus)) {
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
      create: {
        id: project.projectId,
        name: project.projectName,
        format: exportFormat,
        fileTransformerId: exportFileTransformerId,
      },
    });
    let retval: ExportResult | null = null;
    try {
      retval = await exportProject(project.projectId as string, name, exportFormat, exportFileTransformerId);
    } catch (error) {
      retval = {
        exportId: 'dummyexport',
        fileUrl: 'dummyfile',
      } as ExportResult;
      getLogger().error(`fail in exportProject query`, { error: JSON.stringify(error), message: error.message });
    }
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
      scriptState.updateStatesFromProjectExportJobs([{ ...jobResult, status: JobStatus.FAILED as JobStatus }]);
    }
    await scriptState.save();
    results.push(temp);
  }

  const exportOK = results.filter((r) => r.jobStatus === 'PUBLISHED' || r.jobStatus === JobStatus.DELIVERED);
  const exportFail = results.filter((r) => !(r.jobStatus === 'PUBLISHED' || r.jobStatus === JobStatus.DELIVERED));
  getLogger().info(
    `completed ${results.length} export jobs; ${exportOK.length} successful and ${exportFail.length} failed`,
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
