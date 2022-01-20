import packageJson from '../../../package.json';
import { getConfig } from '../../config/config';
import { getJobs, Job, JobStatus } from '../../datasaur/get-jobs';
import { getProjects } from '../../datasaur/get-projects';
import { Project } from '../../datasaur/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../object-storage';
import { getBucketName, getObjectName } from '../object-storage/helper';
import { ProjectState, TeamProjectsState } from './team-projects-states';

export class ScriptState {
  private teams: TeamProjectsState[];
  private createdAt: Date;
  public updatedAt: Date;
  private version: string;
  private static stateFilePath: string;
  private static activeTeamId: string;

  constructor(oldState: ScriptState);
  constructor();

  constructor(oldState?: ScriptState) {
    if (oldState) {
      (this.teams = oldState.teams.map((tps) => new TeamProjectsState(tps))), (this.createdAt = oldState.createdAt);
      this.updatedAt = oldState.updatedAt;
      this.version = oldState.version;
    } else {
      this.teams = [];
      this.createdAt = new Date();
      this.updatedAt = new Date();
      this.version = packageJson.version;
    }
  }

  public static async fromConfig() {
    ScriptState.stateFilePath = getConfig().documents.stateFilePath;
    ScriptState.activeTeamId = getConfig().project.teamId;
    if (ScriptState.stateFilePath) {
      try {
        getLogger().info('reading state...');
        const scriptState = JSON.parse(
          await getStorageClient().getFileContent(
            getBucketName(ScriptState.stateFilePath),
            getObjectName(ScriptState.stateFilePath),
          ),
        );
        getLogger().info('parsing state finished');
        return new ScriptState(scriptState);
      } catch (error) {
        getLogger().error('error in parsing state', error);
        throw new Error(`Error parsing state file from ${ScriptState.stateFilePath}`);
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
    jobs.forEach((job: Job) => {
      this.getTeamProjectsState().updateByJobId(job.id, { status: job.status, projectId: job.resultId });
    });
    this.updateTimeStamp();
  }

  async updateInProgressStates() {
    let inProgressStates = this.getTeamProjectsState()
      .getProjects()
      .filter((state) => state.status === JobStatus.IN_PROGRESS);

    const latestResult = await getJobs(inProgressStates.map((s) => s.jobId));
    this.updateStatesFromJobs(latestResult);

    const existingProjects = (await getProjects({ teamId: this.getActiveTeamId() })).filter((project) => {
      return inProgressStates.some((state) => state.projectName === project.name);
    });

    this.updateStatesFromProjects(existingProjects);
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

  async save() {
    const stateFilePath = ScriptState.stateFilePath;
    if (stateFilePath) {
      try {
        getLogger().info('saving state...');
        await getStorageClient().setFileContent(
          getBucketName(stateFilePath),
          getObjectName(stateFilePath),
          JSON.stringify(this, null, 2),
        );
        getLogger().info('saving finished');
      } catch (error) {
        getLogger().error('error in saving state', error);
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
    this.updatedAt = new Date();
  }
}
