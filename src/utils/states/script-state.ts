import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import packageJson from '../../../package.json';
import { getActiveTeamId as getActiveTeamIdFromConfig, getConfig } from '../../config/config';
import { StatefileConfig, StorageSources } from '../../config/interfaces';
import { getJobs, Job, JobStatus } from '../../datasaur/get-jobs';
import { getProjects } from '../../datasaur/get-projects';
import { Project } from '../../datasaur/interfaces';
import { getLogger } from '../../logger';
import { DeepPartial } from '../interfaces';
import { getStorageClient } from '../object-storage';
import { CreateJobState, ProjectState } from './interfaces';
import { TeamProjectsState } from './team-projects-state';

const IMPLEMENTED_STATE_SOURCE = [
  StorageSources.LOCAL,
  StorageSources.AMAZONS3,
  StorageSources.GOOGLE,
  StorageSources.AZURE,
];

export class ScriptState {
  private teams: TeamProjectsState[];
  private createdAt: number;
  private updatedAt: number;
  private version: string;
  private static activeTeamId: string;
  private static stateConfig: StatefileConfig;

  constructor(oldState: ScriptState);
  constructor();

  constructor(oldState?: ScriptState) {
    if (oldState) {
      this.teams = oldState.teams.map((tps) => new TeamProjectsState(tps));
      this.createdAt = new Date(oldState.createdAt).getTime();
      this.updatedAt = new Date(oldState.updatedAt).getTime();
      this.version = oldState.version;

      if (this.version !== packageJson.version) {
        getLogger().warn(`different Robosaur version detected from statefile`);
      }
    } else {
      this.teams = [];
      this.createdAt = Date.now();
      this.updatedAt = Date.now();
      this.version = packageJson.version;
    }
  }

  public static async fromConfig() {
    ScriptState.stateConfig = getConfig().projectState;
    ScriptState.activeTeamId = getActiveTeamIdFromConfig();
    if (ScriptState.stateConfig?.path) {
      try {
        getLogger().info('reading state...');
        const scriptState = JSON.parse(await ScriptState.readStateFile());
        getLogger().info('parsing state finished');
        return new ScriptState(scriptState);
      } catch (error) {
        if (error.code === 'BlobNotFound') {
          getLogger().info('State blob not found in Azure, proceeding to create one...');
        } else {
          getLogger().error('error in parsing state', { error: JSON.stringify(error), message: error.message });
        }
        throw new Error(`error parsing state file from ${ScriptState.stateConfig.path}`);
      }
    } else {
      getLogger().warn('no stateFilePath is configured, creating new in-memory state');
      return new ScriptState();
    }
  }

  addProject(projectState: ProjectState) {
    const currentTeam = this.getActiveTeamId();
    this.getTeamProjectsState(currentTeam).push(projectState);
    this.updateTimeStamp();
  }

  addProjectsToExport(projects: Project[]) {
    for (const project of projects) {
      this.getTeamProjectsState().updateByProjectName(project.name, {
        projectId: project.id,
        projectName: project.name,
        updatedAt: Date.now(),
        projectStatus: project.status,
      });
    }
  }

  removeProjectsFromExport(projectNames: string[]) {
    for (const projectName of projectNames) {
      this.getTeamProjectsState().removeExport(projectName);
    }
  }

  updateStatesFromProjectCreationJobs(jobs: Job[]) {
    for (const job of jobs) {
      this.getTeamProjectsState().updateByCreateJobId(job.id, {
        create: { jobStatus: job.status, jobId: job.id, errors: job.errors },
        projectId: job.resultId,
      });
    }
    this.updateTimeStamp();
  }

  updateStatesFromProjectExportJobs(jobs: Job[]) {
    for (const job of jobs) {
      this.getTeamProjectsState().updateByExportJobId(job.id, {
        export: {
          jobId: job.id,
          jobStatus: job.status,
        },
      });
    }
    this.updateTimeStamp();
  }

  updateStateByProjectName(projectName: string, newProjectState: DeepPartial<ProjectState>) {
    return this.getTeamProjectsState().updateByProjectName(projectName, newProjectState);
  }

  async updateInProgressProjectCreationStates() {
    let inProgressStates = Array.from(this.getTeamProjectsState().getProjects())
      .filter(([_key, state]) => state.create?.jobStatus === JobStatus.IN_PROGRESS)
      .map(([_key, state]) => state);

    if (inProgressStates.length === 0) return;

    getLogger().info(`found several IN_PROGRESS jobs in state, fetching latest information from Datasaur...`);
    const latestResult = await getJobs(inProgressStates.map((s) => s.create?.jobId));
    this.updateStatesFromProjectCreationJobs(latestResult);

    inProgressStates = Array.from(this.getTeamProjectsState().getProjects())
      .filter(([_key, state]) => state.create?.jobStatus === JobStatus.IN_PROGRESS)
      .map(([_key, state]) => state);

    if (inProgressStates.length > 0) {
      const allProjects = await getProjects({ teamId: this.getActiveTeamId() });
      const relevantProjects = allProjects.filter((project) => {
        return inProgressStates.some((state) => state.projectName === project.name);
      });
      this.setProjectCreationStateAsDelivered(relevantProjects);
    }

    this.updateTimeStamp();
  }

  getActiveTeamId() {
    return ScriptState.activeTeamId;
  }

  getProjectStateByProjectName(name: string) {
    return this.getTeamProjectsState().getProjects().get(name);
  }

  getTeamProjectsState(): TeamProjectsState;
  getTeamProjectsState(teamId: string): TeamProjectsState;

  getTeamProjectsState(teamId?: string): TeamProjectsState {
    teamId = teamId ?? this.getActiveTeamId();
    const index = this.teams.findIndex((team) => team.getTeamId() === teamId);
    if (index === -1) {
      const newTeamState = new TeamProjectsState(teamId);
      this.teams.push(newTeamState);
      return newTeamState;
    }
    return this.teams[index];
  }

  projectNameHasBeenUsed(name: string) {
    return Array.from(this.getTeamProjectsState().getProjects()).some(
      ([_key, { projectName, create }]) => projectName === name && create?.jobStatus === JobStatus.DELIVERED,
    );
  }

  async save() {
    if (ScriptState.stateConfig.path) {
      try {
        getLogger().info('saving state...');
        await ScriptState.writeStateFile(this);
        getLogger().info('saving finished');
      } catch (error) {
        getLogger().error('error when saving state', {
          error: JSON.stringify(error),
          message: error.message,
          stack: error?.stack,
        });
        throw new Error('error in saving state');
      }
    } else {
      getLogger().warn('no stateFilePath is configured, skipping...');
    }
  }

  private setProjectCreationStateAsDelivered(projects: Project[]) {
    projects.forEach((p) =>
      this.getTeamProjectsState().updateByProjectName(p.name, {
        create: { jobStatus: JobStatus.DELIVERED } as CreateJobState,
        projectId: p.id,
      }),
    );
  }

  private updateTimeStamp() {
    this.updatedAt = Date.now();
  }

  private static async readStateFile() {
    switch (ScriptState.stateConfig.source) {
      case StorageSources.AMAZONS3:
      case StorageSources.AZURE:
      case StorageSources.GOOGLE:
        return getStorageClient(ScriptState.stateConfig.source).getStringFileContent(
          ScriptState.stateConfig.bucketName,
          ScriptState.stateConfig.path,
        );
      case StorageSources.LOCAL:
        if (!existsSync(ScriptState.stateConfig.path)) throw new Error('state file not found');
        return readFileSync(ScriptState.stateConfig.path, { encoding: 'utf-8' });
      default:
        getLogger().error(
          `${ScriptState.stateConfig.source} is unsupported. Please use one of ${JSON.stringify(
            IMPLEMENTED_STATE_SOURCE,
          )}`,
        );
        throw new Error(`unsupported source: ${ScriptState.stateConfig.source}`);
    }
  }

  private static async writeStateFile(content: ScriptState) {
    switch (ScriptState.stateConfig.source) {
      case StorageSources.AMAZONS3:
      case StorageSources.AZURE:
      case StorageSources.GOOGLE:
        await getStorageClient(ScriptState.stateConfig.source).setStringFileContent(
          ScriptState.stateConfig.bucketName,
          ScriptState.stateConfig.path,
          JSON.stringify(content, null, 2),
        );
        return;
      case StorageSources.LOCAL:
        mkdirSync(path.dirname(ScriptState.stateConfig.path), { recursive: true });
        return writeFileSync(ScriptState.stateConfig.path, JSON.stringify(content), { encoding: 'utf-8' });
      default:
        getLogger().error(
          `${ScriptState.stateConfig.source} is unsupported. Please use one of ${JSON.stringify(
            IMPLEMENTED_STATE_SOURCE,
          )}`,
        );
        throw new Error(`unsupported source: ${ScriptState.stateConfig.source}`);
    }
  }

  toJSON() {
    return {
      version: this.version,
      createdAt: new Date(this.createdAt).toISOString(),
      updatedAt: new Date(this.updatedAt).toISOString(),
      teams: this.teams,
    };
  }
}
