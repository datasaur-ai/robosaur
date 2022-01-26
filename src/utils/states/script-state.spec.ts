import { JobStatus } from '../../datasaur/get-jobs';
import { ScriptState } from './script-state';
import { ProjectState, TeamProjectsState } from './team-projects-state';
import { dummyPopulateProjects } from './test-helper';

describe(ScriptState.name, () => {
  describe(ScriptState.prototype.projectNameHasBeenUsed, () => {
    let state: ScriptState;
    beforeEach(() => {
      state = new ScriptState();
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
      jest.spyOn(state, 'getTeamProjectsState').mockReturnValue(new TeamProjectsState('dummy-team'));
    });

    it('should return true when argument has been used as a project name', () => {
      const output = state.projectNameHasBeenUsed('delivered-project');
      expect(output).toBeTruthy();
    });

    it('should return false when argument has not been used as a project name', () => {
      const output = state.projectNameHasBeenUsed('unfinished-project');
      expect(output).toBeFalsy();
    });
  });

  describe(ScriptState.prototype.addProject, () => {
    let state: ScriptState;
    const ACTIVE_TEAM = 'active-team';
    const OTHER_TEAM = 'other-team';

    beforeEach(() => {
      state = new ScriptState();
      jest.spyOn(state, 'getActiveTeamId').mockReturnValue(ACTIVE_TEAM);

      dummyPopulateProjects(ACTIVE_TEAM, 4, state);
      dummyPopulateProjects(OTHER_TEAM, 4, state);
    });

    it('should add project only to the current active team', () => {
      // push project to the script state as a whole
      // state should only push to active team state
      const dummyNewProject = { projectName: 'newly-added-project' };
      state.addProject(dummyNewProject as ProjectState);

      expect(state.getTeamProjectsState().getProjects().size).toBeGreaterThan(
        state.getTeamProjectsState(OTHER_TEAM).getProjects().size,
      );

      expect(state.getTeamProjectsState(ACTIVE_TEAM).getProjects().get(dummyNewProject.projectName)).toBeTruthy();

      expect(state.getTeamProjectsState(OTHER_TEAM).getProjects().get(dummyNewProject.projectName)).toBeFalsy();
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
