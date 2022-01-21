import { existsSync, readFileSync, writeFileSync } from 'fs';
import packageJson from '../../../package.json';
import { getConfig } from '../../config/config';
import { StorageSources } from '../../config/interfaces';
import { getJobs, Job, JobStatus } from '../../datasaur/get-jobs';
import { getProjects } from '../../datasaur/get-projects';
import { Project } from '../../datasaur/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../object-storage';
import { getBucketName, getObjectName } from '../object-storage/helper';
import { ProjectState, TeamProjectsState } from './team-projects-state';

const IMPLEMENTED_STATE_SOURCE = [StorageSources.LOCAL, StorageSources.AMAZONS3, StorageSources.GOOGLE];

export class ScriptState {
  private teams: TeamProjectsState[];
  private createdAt: number;
  private updatedAt: number;
  private version: string;
  private static stateFilePath: string;
  private static activeTeamId: string;
  private static source: StorageSources;

  constructor(oldState: ScriptState);
  constructor();

  constructor(oldState?: ScriptState) {
    if (oldState) {
      this.teams = oldState.teams.map((tps) => new TeamProjectsState(tps));
      this.createdAt = oldState.createdAt;
      this.updatedAt = oldState.updatedAt;
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
    ScriptState.stateFilePath = getConfig().documents.stateFilePath;
    ScriptState.source = getConfig().documents.source;
    ScriptState.activeTeamId = getConfig().project.teamId;
    if (ScriptState.stateFilePath) {
      try {
        getLogger().info('reading state...');
        const scriptState = JSON.parse(await ScriptState.readStateFile());
        getLogger().info('parsing state finished');
        return new ScriptState(scriptState);
      } catch (error) {
        getLogger().error('error in parsing state', { error });
        throw new Error(`error parsing state file from ${ScriptState.stateFilePath}`);
      }
    } else {
      getLogger().warn('no stateFilePath is configured, creating new in-memory state');
      return new ScriptState();
    }
  }

  addProject(project: ProjectState) {
    const currentTeam = this.getActiveTeamId();
    this.getTeamProjectsState(currentTeam).push(project);
    this.updateTimeStamp();
  }

  updateStatesFromJobs(jobs: Job[]) {
    for (const job of jobs) {
      this.getTeamProjectsState().updateByJobId(job.id, {
        status: job.status,
        projectId: job.resultId,
      });
    }
    this.updateTimeStamp();
  }

  async updateInProgressStates() {
    let inProgressStates = this.getTeamProjectsState()
      .getProjects()
      .filter((state) => state.status === JobStatus.IN_PROGRESS);

    const latestResult = await getJobs(inProgressStates.map((s) => s.jobId));
    this.updateStatesFromJobs(latestResult);

    inProgressStates = this.getTeamProjectsState()
      .getProjects()
      .filter((state) => state.status === JobStatus.IN_PROGRESS);

    if (inProgressStates.length > 0) {
      const allProjects = await getProjects({ teamId: this.getActiveTeamId() });
      const relevantProjects = allProjects.filter((project) => {
        return inProgressStates.some((state) => state.projectName === project.name);
      });
      this.updateStatesFromProjects(relevantProjects);
    }

    this.updateTimeStamp();
  }

  getActiveTeamId() {
    return ScriptState.activeTeamId;
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
    return this.getTeamProjectsState()
      .getProjects()
      .some(({ projectName, status }) => projectName === name && status === JobStatus.DELIVERED);
  }

  async save() {
    const stateFilePath = ScriptState.stateFilePath;
    if (stateFilePath) {
      try {
        getLogger().info('saving state...');
        await ScriptState.writeStateFile(this);
        getLogger().info('saving finished');
      } catch (error) {
        getLogger().error('error in saving state:', { error });
      }
    } else {
      getLogger().warn('no stateFilePath is configured, skipping...');
    }
  }

  private updateStatesFromProjects(projects: Project[]) {
    projects.forEach((p) =>
      this.getTeamProjectsState().updateByProjectName(p.name, { status: JobStatus.DELIVERED, projectId: p.id }),
    );
  }

  private updateTimeStamp() {
    this.updatedAt = Date.now();
  }

  private static async readStateFile() {
    switch (ScriptState.source) {
      case StorageSources.AMAZONS3:
      case StorageSources.GOOGLE:
        return getStorageClient().getFileContent(
          getBucketName(ScriptState.stateFilePath),
          getObjectName(ScriptState.stateFilePath),
        );
      case StorageSources.LOCAL:
        if (!existsSync(ScriptState.stateFilePath)) throw new Error('state file not found');
        return readFileSync(ScriptState.stateFilePath, { encoding: 'utf-8' });
      default:
        getLogger().error(
          `${ScriptState.source} is unsupported. Please use one of ${JSON.stringify(IMPLEMENTED_STATE_SOURCE)}`,
        );
        throw new Error(`unsupported source: ${ScriptState.source}`);
    }
  }

  private static async writeStateFile(content: ScriptState) {
    switch (ScriptState.source) {
      case StorageSources.AMAZONS3:
      case StorageSources.GOOGLE:
        await getStorageClient().setFileContent(
          getBucketName(ScriptState.stateFilePath),
          getObjectName(ScriptState.stateFilePath),
          JSON.stringify(content, null, 2),
        );
        return;
      case StorageSources.LOCAL:
        return writeFileSync(ScriptState.stateFilePath, JSON.stringify(content), { encoding: 'utf-8' });
      default:
        getLogger().error(
          `${ScriptState.source} is unsupported. Please use one of ${JSON.stringify(IMPLEMENTED_STATE_SOURCE)}`,
        );
        throw new Error(`unsupported source: ${ScriptState.source}`);
    }
  }
}
