import { JobStatus } from '../../datasaur/get-jobs';
import { DeepPartial } from '../interfaces';
import { ProjectState } from './interfaces';
import { ScriptState } from './script-state';
import { TeamProjectsState } from './team-projects-state';

export function dummyPopulateProjects(teamId: string, projectCount: number, state: ScriptState) {
  dummyPopulateTeamProjectState(projectCount, state.getTeamProjectsState(teamId));
}

export function dummyPopulateTeamProjectState(
  projectCount: number,
  state: TeamProjectsState,
  template: DeepPartial<ProjectState> = { create: { jobStatus: JobStatus.NONE } },
) {
  for (let index = 0; index < projectCount; index++) {
    const identifier = `${state.getTeamId()}-${index}`;

    // manually get team's state, and push a project to it
    state.push({
      projectId: identifier,
      projectName: identifier,
      ...template,

      create: {
        jobId: `job-${identifier}`,
        ...template?.create,
      },

      export: {
        ...template?.export,
      },
    } as ProjectState);
  }
}

export function getRandomPropertyValue(arrayOfObjects: any[], propertyKey: string) {
  const [minNumber, maxNumber] = [0, arrayOfObjects.length];
  const selectedNumber = Math.floor(Math.random() * (maxNumber - minNumber) + minNumber);
  return arrayOfObjects[selectedNumber][propertyKey];
}
