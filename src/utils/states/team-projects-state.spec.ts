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

  describe(TeamProjectsState.prototype.updateByIndex, () => {
    it('should not update any state when index is out of bounds', () => {
      const previousLength = teamState.getProjects().length;
      const largerThanMaximumIndex = previousLength + 1;
      teamState.updateByIndex(largerThanMaximumIndex, { status: JobStatus.DELIVERED });

      expect(teamState.getProjects().length).toBeLessThan(largerThanMaximumIndex);
      expect(teamState.getProjects().length).toEqual(previousLength);
    });

    it('should only update the specified index', () => {
      const toUpdate = 2;
      const newName = 'updated';
      teamState.updateByIndex(toUpdate, { projectName: newName });

      teamState.getProjects().forEach((p, index) => {
        if (index === toUpdate) expect(p.projectName).toEqual(newName);
        else expect(p.projectName).not.toEqual(newName);
      });
    });
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
      const projectName = getRandomPropertyValue(teamState.getProjects(), 'projectName');

      const expectedIndex = teamState.getProjects().findIndex((p) => p.projectName === projectName);

      const retval = teamState.updateByProjectName(projectName, { status: JobStatus.DELIVERED });
      expect(retval).toEqual(expectedIndex);
      expect(teamState.getProjects()[retval].status).toEqual(JobStatus.DELIVERED);
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
      const jobId = getRandomPropertyValue(teamState.getProjects(), 'jobId');

      const expectedIndex = teamState.getProjects().findIndex((p) => p.jobId === jobId);

      const retval = teamState.updateByJobId(jobId, { status: JobStatus.DELIVERED });
      expect(retval).toEqual(expectedIndex);
      expect(teamState.getProjects()[retval].status).toEqual(JobStatus.DELIVERED);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
