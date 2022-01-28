import { JobStatus } from '../../datasaur/get-jobs';
import { DeepPartial } from '../interface';

export interface JobState {
  jobId: string | null | undefined;
  jobStatus: JobStatus;
  createdAt?: number;
  updatedAt?: number;
  errors: any;
}
export interface ProjectState {
  create?: JobState;
  // TODO: to be detailed in 10243
  export?: JobState;

  projectName: string;
  documents: Array<{ name: string }>;
  projectId: string | null | undefined;
  createdAt?: number;
  updatedAt?: number;
}

export class TeamProjectsState {
  private projects: Map<string, ProjectState>;
  private id: string;

  constructor(id: string);
  constructor(loadedTeamProjects: TeamProjectsState);

  constructor(args: string | TeamProjectsState) {
    if (typeof args === 'string') {
      this.id = args;
      this.projects = new Map<string, ProjectState>();
    } else {
      this.id = args.id;
      this.projects = new Map<string, ProjectState>();
      args.projects.forEach((p: Required<ProjectState>, key) => {
        this.projects.set(key, {
          ...p,
          createdAt: new Date(p.createdAt).getTime(),
          updatedAt: new Date(p.updatedAt).getTime(),
        });
      });
    }
  }

  push(newProject: ProjectState) {
    this.projects.set(newProject.projectName, { ...newProject, createdAt: Date.now(), updatedAt: Date.now() });
  }

  updateByCreateJobId(jobid: string, newProjectData: DeepPartial<ProjectState>) {
    let identifier = '';
    for (const [key, project] of this.projects) {
      if (project.create?.jobId === jobid) {
        identifier = key;
        break;
      }
    }

    return this.update(identifier, { ...newProjectData });
  }

  updateByProjectName(projectName: string, newProjectData: DeepPartial<ProjectState>) {
    return this.update(projectName, newProjectData);
  }

  getProjects() {
    return this.projects;
  }

  getTeamId() {
    return this.id;
  }

  private update(identifier: string, newProjectData: DeepPartial<ProjectState>) {
    if (!identifier) return -1;

    const existingData = this.projects.get(identifier);
    if (!existingData) return -1;

    this.projects.set(identifier, {
      ...existingData,
      ...newProjectData,
      create: {
        ...existingData.create,
        ...newProjectData.create,
      },
      export: {
        ...existingData.export,
        ...newProjectData.export,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as ProjectState);
    return identifier;
  }

  toJSON() {
    const arrayProjects: any[] = [];
    for (const [key, project] of this.projects) {
      arrayProjects.push({
        ...project,
        createdAt: new Date(project.createdAt as number).toISOString(),
        updatedAt: new Date(project.updatedAt as number).toISOString(),
      });
    }

    const retvalObject = {
      id: this.id,
      projects: arrayProjects,
    };
    return retvalObject;
  }
}
