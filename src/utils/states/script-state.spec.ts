import * as GetJob from '../../datasaur/get-jobs';
import { Job, JobStatus } from '../../datasaur/get-jobs';
import { Project, ProjectStatus } from '../../datasaur/interfaces';
import { ProjectState } from './interfaces';
import { ScriptState } from './script-state';
import { TeamProjectsState } from './team-projects-state';
import { dummyPopulateProjects } from './test-helper';

describe(ScriptState.name, () => {
  const ACTIVE_TEAM = 'active-team';
  const OTHER_TEAM = 'other-team';
  let scriptState: ScriptState;

  beforeEach(() => {
    scriptState = new ScriptState();
    jest.spyOn(scriptState, 'getActiveTeamId').mockReturnValue(ACTIVE_TEAM);
  });

  describe(ScriptState.prototype.projectNameHasBeenUsed, () => {
    beforeEach(() => {
      const dummyMap = new Map();
      dummyMap.set('delivered-project', {
        projectName: 'delivered-project',
        create: { jobStatus: JobStatus.DELIVERED },
      } as ProjectState);
      dummyMap.set('inprogress-project', {
        projectName: 'inprogress-project',
        create: { jobStatus: JobStatus.IN_PROGRESS },
      } as ProjectState);

      jest.spyOn(TeamProjectsState.prototype, 'getProjects').mockReturnValue(dummyMap);
      jest.spyOn(scriptState, 'getTeamProjectsState').mockReturnValue(new TeamProjectsState(ACTIVE_TEAM));
    });

    it('should return true when argument has been used as a project name', () => {
      const output = scriptState.projectNameHasBeenUsed('delivered-project');
      expect(output).toBeTruthy();
    });

    it('should return false when argument has not been used as a project name', () => {
      const output = scriptState.projectNameHasBeenUsed('unfinished-project');
      expect(output).toBeFalsy();
    });
  });

  describe(ScriptState.prototype.addProject, () => {
    beforeEach(() => {
      dummyPopulateProjects(ACTIVE_TEAM, 4, scriptState);
      dummyPopulateProjects(OTHER_TEAM, 4, scriptState);
    });

    it('should add project only to the current active team', () => {
      // push project to the script state as a whole
      // state should only push to active team state
      const dummyNewProject = { projectName: 'newly-added-project' };
      scriptState.addProject(dummyNewProject as ProjectState);

      expect(scriptState.getTeamProjectsState().getProjects().size).toBeGreaterThan(
        scriptState.getTeamProjectsState(OTHER_TEAM).getProjects().size,
      );

      expect(scriptState.getTeamProjectsState(ACTIVE_TEAM).getProjects().get(dummyNewProject.projectName)).toBeTruthy();

      expect(scriptState.getTeamProjectsState(OTHER_TEAM).getProjects().get(dummyNewProject.projectName)).toBeFalsy();
    });
  });

  describe(ScriptState.prototype.addProjectsToExport, () => {
    beforeEach(() => {
      dummyPopulateProjects(ACTIVE_TEAM, 4, scriptState);
      dummyPopulateProjects(OTHER_TEAM, 4, scriptState);
    });

    it('should add project only to the current active team', () => {
      // push project to the script state as a whole
      // state should only push to active team state
      const dummyNewProject = {
        name: 'newly-added-project',
        id: 'newly-added-project',
        status: ProjectStatus.CREATED,
      } as Project;
      scriptState.addProjectsToExport([dummyNewProject]);

      expect(scriptState.getTeamProjectsState().getProjects().size).toBeGreaterThan(
        scriptState.getTeamProjectsState(OTHER_TEAM).getProjects().size,
      );

      expect(scriptState.getTeamProjectsState(ACTIVE_TEAM).getProjects().get(dummyNewProject.name)).toBeTruthy();

      expect(scriptState.getTeamProjectsState(OTHER_TEAM).getProjects().get(dummyNewProject.name)).toBeFalsy();
    });
  });

  describe(ScriptState.prototype.updateInProgressProjectCreationStates, () => {
    beforeEach(() => {
      dummyPopulateProjects(ACTIVE_TEAM, 2, scriptState, { create: { jobStatus: JobStatus.IN_PROGRESS } });
      dummyPopulateProjects(ACTIVE_TEAM, 1, scriptState, { create: { jobStatus: JobStatus.NONE } });
      dummyPopulateProjects(ACTIVE_TEAM, 1, scriptState, { create: { jobStatus: JobStatus.FAILED } });

      dummyPopulateProjects(ACTIVE_TEAM, 1, scriptState, { export: { jobStatus: JobStatus.IN_PROGRESS } });

      jest.spyOn(GetJob, 'getJobs').mockImplementation(async (ids: string[]) => {
        return ids.map((id) => ({ id, status: JobStatus.DELIVERED } as Job));
      });
    });

    it('should only update state where create.jobStatus IN_PROGRESS', async () => {
      const inProgressCreations = Array.from(scriptState.getTeamProjectsState().getProjects())
        .filter(([_key, state]) => {
          return state.create?.jobStatus === JobStatus.IN_PROGRESS;
        })
        .map(([_key, state]) => state.projectName);
      const inProgressExports = Array.from(scriptState.getTeamProjectsState().getProjects())
        .filter(([_key, state]) => {
          return state.export?.jobStatus === JobStatus.IN_PROGRESS;
        })
        .map(([_key, state]) => state.projectName);

      await scriptState.updateInProgressProjectCreationStates();

      for (const name of inProgressCreations) {
        expect(scriptState.getProjectStateByProjectName(name)?.create?.jobStatus).toEqual(JobStatus.DELIVERED);
      }

      for (const name of inProgressExports) {
        expect(scriptState.getProjectStateByProjectName(name)?.create?.jobStatus).not.toEqual(JobStatus.DELIVERED);
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
