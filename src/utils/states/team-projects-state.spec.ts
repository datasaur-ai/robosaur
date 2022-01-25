import { assert } from 'console';
import { JobStatus } from '../../datasaur/get-jobs';
import { TeamProjectsState } from './team-projects-state';
import { dummyPopulateTeamProjectState, getRandomPropertyValue } from './test-helper';

describe(TeamProjectsState.name, () => {
  let teamState: TeamProjectsState;
  beforeEach(() => {
    teamState = new TeamProjectsState('dummy-team');
    dummyPopulateTeamProjectState(4, teamState, { status: JobStatus.IN_PROGRESS });
  });

  describe(TeamProjectsState.prototype.updateByProjectName, () => {
    it('should return -1 and not change anything when specified projectName is not found', () => {
      const projectName = 'non-exist-project';
      const prev = JSON.stringify(teamState);

      const retval = teamState.updateByProjectName(projectName, { status: JobStatus.DELIVERED });
      expect(retval).toEqual(-1);
      expect(JSON.stringify(teamState)).toEqual(prev);
    });

    it('should only change one specific item matching projectName', () => {
      const projectName = getRandomPropertyValue(
        [...teamState.getProjects()].map(([key, project]) => project),
        'projectName',
      );

      const retval = teamState.updateByProjectName(projectName, { status: JobStatus.DELIVERED });
      expect(retval).toEqual(projectName);
      expect(teamState.getProjects().get(retval as string)?.status).toEqual(JobStatus.DELIVERED);
    });
  });

  describe(TeamProjectsState.prototype.updateByJobId, () => {
    it('should return -1 and not change anything when specified jobId is not found', () => {
      const jobId = 'non-exist-jobid';
      const prev = JSON.stringify(teamState);

      const retval = teamState.updateByJobId(jobId, { status: JobStatus.FAILED });
      expect(retval).toEqual(-1);
      expect(JSON.stringify(teamState)).toEqual(prev);
    });

    it('should only change one specific item matching jobId', () => {
      const expectedProjectName = getRandomPropertyValue(
        [...teamState.getProjects()].map(([_key, project]) => project),
        'projectName',
      );

      const jobId = teamState.getProjects().get(expectedProjectName)?.jobId as string;

      const retval = teamState.updateByJobId(jobId, { status: JobStatus.DELIVERED });
      expect(retval).toEqual(expectedProjectName);
      expect(teamState.getProjects().get(retval as string)?.status).toEqual(JobStatus.DELIVERED);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
