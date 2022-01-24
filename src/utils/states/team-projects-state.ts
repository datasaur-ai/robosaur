import { JobStatus } from '../../datasaur/get-jobs';

export interface ProjectState {
  jobId: string | null | undefined;
  projectName: string;
  documents: Array<{ name: string }>;
  projectId: string | null | undefined;
  status: JobStatus;
  createdAt?: number;
  updatedAt?: number;
}

export class TeamProjectsState {
  private projects: ProjectState[];
  private id: string;

  constructor(id: string);
  constructor(loadedTeamProjects: TeamProjectsState);

  constructor(args: string | TeamProjectsState) {
    if (typeof args === 'string') {
      this.id = args;
      this.projects = [];
    } else {
      this.id = args.id;
      this.projects = args.projects.map((p: Required<ProjectState>) => ({
        ...p,
        createdAt: new Date(p.createdAt).getTime(),
        updatedAt: new Date(p.updatedAt).getTime(),
      }));
    }
  }

  push(newProject: ProjectState) {
    this.projects.push({ ...newProject, createdAt: Date.now(), updatedAt: Date.now() });
  }

  updateByJobId(jobid: string, newProjectData: Partial<ProjectState>) {
    const toUpdate = this.projects.findIndex((s) => s.jobId === jobid);
    if (toUpdate === -1) return -1;

    return this.update(toUpdate, newProjectData);
  }

  updateByProjectName(projectName: string, newProjectData: Partial<ProjectState>) {
    const toUpdate = this.projects.findIndex((s) => s.projectName === projectName);
    if (toUpdate === -1) return -1;

    return this.update(toUpdate, newProjectData);
  }

  updateByIndex(index: number, newProjectData: Partial<ProjectState>) {
    if (index < this.projects.length) return this.update(index, newProjectData);

    return -1;
  }

  getProjects() {
    return this.projects;
  }

  getTeamId() {
    return this.id;
  }

  private update(identifier: number, newProjectData: Partial<ProjectState>) {
    if (identifier === -1) return -1;

    for (const [key, value] of Object.entries(newProjectData)) {
      this.projects[identifier][key] = value;
    }
    this.projects[identifier].updatedAt = Date.now();

    return identifier;
  }

  toJSON() {
    const retvalObject = {
      id: this.id,
      projects: this.getProjects().map((p) => ({
        ...p,
        createdAt: new Date(p.createdAt as number).toISOString(),
        updatedAt: new Date(p.updatedAt as number).toISOString(),
      })),
    };
    return retvalObject;
  }
}
