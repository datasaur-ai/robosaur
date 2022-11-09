import { getConfig } from '../config/config';
import { autoLabelTokenProject } from '../datasaur/auto-label';
import { JobStatus } from '../datasaur/get-jobs';
import { createSimpleHandlerContext } from '../execution';
import { AutoLabelProjectOptionsInput, GqlAutoLabelServiceProvider, Job } from '../generated/graphql';
import { getLogger } from '../logger';
import { pollJobsUntilCompleted } from '../utils/polling.helper';
import { getState } from '../utils/states/getStates';
import { ProjectState } from '../utils/states/interfaces';
import { ScriptState } from '../utils/states/script-state';
import { AutoLabelError } from './error/auto-label-error';

export const handleAutoLabel = createSimpleHandlerContext('auto-label', _handleAutoLabel);

async function _handleAutoLabel(
  projects: { name: string; fullPath: string }[],
  dryRun: boolean,
  errorCallback?: (error: Error) => Promise<void>,
) {
  if (!getConfig().create.autoLabel?.enableAutoLabel) return;

  const scriptState = await getState();
  const projectsToAutoLabel = getProjectsToAutoLabel(projects, scriptState);

  const autoLabelResults = await submitAutoLabelJob(projectsToAutoLabel, dryRun);
  await checkAutoLabelJob(autoLabelResults, dryRun, errorCallback);
}

function getProjectsToAutoLabel(projectsToBeCreated: { name: string; fullPath: string }[], scriptState: ScriptState) {
  const newProjectNames = projectsToBeCreated.map((project) => project.name);
  return new Map(
    [...scriptState.getTeamProjectsState().getProjects()].filter(([name, _]) => newProjectNames.includes(name)),
  );
}

async function submitAutoLabelJob(projectsToAutoLabel: Map<string, ProjectState>, dryRun: boolean) {
  let results: any[] = [];
  if (dryRun) {
    getLogger().info(`projects to be auto labeled: ${projectsToAutoLabel}`);
  } else {
    const autoLabelConfig = getConfig().create.autoLabel;
    for (const [_, projectState] of projectsToAutoLabel) {
      const targetApiInput = {
        endpoint: autoLabelConfig?.targetApiEndpoint ?? '',
        secretKey: autoLabelConfig?.targetApiSecretKey ?? '',
      };
      const options: AutoLabelProjectOptionsInput = {
        serviceProvider: GqlAutoLabelServiceProvider.Custom,
        numberOfFilesPerRequest: autoLabelConfig?.numberOfFilesPerRequest ?? 1,
      };

      getLogger().info(`submitting auto-label job for ${projectState.projectId}...`);
      const result = await autoLabelTokenProject(
        projectState.projectId ?? '',
        autoLabelConfig?.labelerEmail ?? '',
        targetApiInput,
        options,
      );
      results.push(result);
    }
  }
  return results;
}

async function checkAutoLabelJob(results: Job[], dryRun: any, errorCallback?: (error: Error) => Promise<void>) {
  if (dryRun) {
    getLogger().info(`check auto label dry run`);
  } else {
    getLogger().info(`sending query for auto label project status...`);

    const jobs = await pollJobsUntilCompleted(results.map((r: { id: any }) => r.id || ''));

    const jobFailed = jobs.filter((j) => j.status === JobStatus.FAILED);
    const jobOK = jobs.filter((j) => j.status === JobStatus.DELIVERED).map((j) => j.id);
    getLogger().info(`all auto label jobs finished.`, { success: jobOK, fail: jobFailed.map((j) => j.id) });
    getLogger().info(`completed ${jobs.length} jobs; ${jobOK.length} successful and ${jobFailed.length} failed`);
    for (const job of jobFailed) {
      getLogger().error(`error for ${job.id}`, { ...job });
      if (errorCallback) {
        await errorCallback(new AutoLabelError(`error for ${job.id}: ${job}`));
      }
    }
  }
}
