import { DeepPartial } from '../interfaces';
import { CreateJobState, ExportJobState, ProjectState } from './interfaces';

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
      ((args.projects as unknown) as Array<ProjectState>).forEach((p: Required<ProjectState>) => {
        this.projects.set(p.projectName, {
          ...p,
          createdAt: new Date(p.createdAt).getTime(),
          updatedAt: new Date(p.updatedAt).getTime(),
        });
      });
    }
  }

  addOrUpdateByProjectName(projectName: string, projectData: DeepPartial<ProjectState>) {
    if (this.projects.get(projectName)) {
      return this.updateByProjectName(projectName, projectData);
    }

    this.push({ ...projectData, documents: [] } as ProjectState);
    return projectName;
  }

  push(newProject: ProjectState) {
    this.projects.set(newProject.projectName, {
      ...newProject,
      create: { ...(newProject.create as CreateJobState), createdAt: Date.now(), updatedAt: Date.now() },
      export: { ...(newProject.export as ExportJobState), createdAt: Date.now(), updatedAt: Date.now() },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  updateByCreateJobId(jobid: string, newProjectState: DeepPartial<ProjectState>) {
    let identifier = '';
    for (const [key, project] of this.projects) {
      if (project.create?.jobId === jobid) {
        identifier = key;
        break;
      }
    }

    return this.update(identifier, newProjectState);
  }

  updateByExportJobId(jobId: string, newProjectState: DeepPartial<ProjectState>) {
    let identifier = '';
    for (const [key, project] of this.projects) {
      if (project.export?.jobId === jobId) {
        identifier = key;
        break;
      }
    }

    return this.update(identifier, newProjectState);
  }

  updateByProjectName(projectName: string, newProjectState: DeepPartial<ProjectState>) {
    return this.update(projectName, newProjectState);
  }

  getProjects() {
    return this.projects;
  }

  getTeamId() {
    return this.id;
  }

  private update(identifier: string, newProjectState: DeepPartial<ProjectState>) {
    if (!identifier) return -1;

    const existingData = this.projects.get(identifier);
    if (!existingData) return -1;

    newProjectState = populateTimeStamp(newProjectState);
    this.projects.set(identifier, {
      ...existingData,
      ...newProjectState,
      create: {
        ...existingData.create,
        ...newProjectState.create,
      },
      export: {
        ...existingData.export,
        ...newProjectState.export,
      },
      updatedAt: Date.now(),
    } as ProjectState);
    return identifier;
  }

  toJSON() {
    const arrayProjects: any[] = [];
    for (const [key, project] of this.projects) {
      arrayProjects.push({
        ...project,

        create: {
          ...project.create,
          createdAt: project.create?.createdAt ? new Date(project.create.createdAt as number).toISOString() : undefined,
          updatedAt: project.create?.updatedAt ? new Date(project.create.updatedAt as number).toISOString() : undefined,
        },

        export: {
          ...project.export,
          createdAt: project.export?.createdAt ? new Date(project.export.createdAt as number).toISOString() : undefined,
          updatedAt: project.export?.updatedAt ? new Date(project.export.updatedAt as number).toISOString() : undefined,
        },

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

// helper function to populate nested timestamp field

function populateTimeStamp(state: DeepPartial<ProjectState>): ProjectState {
  const creationState: Partial<CreateJobState> = { ...state.create };
  if (state.create) {
    creationState.updatedAt = Date.now();
  }

  const exportState: Partial<ExportJobState> = { ...state.export };
  if (state.export) {
    exportState.updatedAt = Date.now();
  }

  return {
    ...state,
    create: { ...creationState },
    export: { ...exportState },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as ProjectState;
}
