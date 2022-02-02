import { JobStatus } from '../../datasaur/get-jobs';
import { ProjectStatus } from '../../datasaur/interfaces';
import { ProjectState } from './interfaces';
import { TeamProjectsState } from './team-projects-state';
import { dummyPopulateTeamProjectState, getRandomPropertyValue } from './test-helper';
import { sleep } from '../sleep';

describe(TeamProjectsState.name, () => {
  let teamState: TeamProjectsState;
  beforeEach(() => {
    teamState = new TeamProjectsState('dummy-team');
  });

  describe(TeamProjectsState.prototype.updateByProjectName, () => {
    beforeEach(() => {
      dummyPopulateTeamProjectState(2, teamState, { create: { jobStatus: JobStatus.IN_PROGRESS } });
      dummyPopulateTeamProjectState(2, teamState, { create: { jobStatus: JobStatus.IN_PROGRESS } });
    });

    it('should return -1 and not change anything when specified projectName is not found', () => {
      const projectName = 'non-exist-project';
      const prev = JSON.stringify(teamState);

      const retval = teamState.updateByProjectName(projectName, { create: { jobStatus: JobStatus.DELIVERED } });
      expect(retval).toEqual(-1);
      expect(JSON.stringify(teamState)).toEqual(prev);
    });

    it('should only change one specific item matching projectName', () => {
      const projectName = getRandomPropertyValue(
        [...teamState.getProjects()].map(([key, project]) => project),
        'projectName',
      );

      const retval = teamState.updateByProjectName(projectName, { create: { jobStatus: JobStatus.DELIVERED } });
      expect(retval).toEqual(projectName);
      expect(teamState.getProjects().get(retval as string)?.create?.jobStatus).toEqual(JobStatus.DELIVERED);
    });
  });

  describe(TeamProjectsState.prototype.updateByCreateJobId, () => {
    beforeEach(() => {
      dummyPopulateTeamProjectState(2, teamState, { create: { jobStatus: JobStatus.IN_PROGRESS } });
    });

    it('should return -1 and not change anything when specified jobId is not found', () => {
      const jobId = 'non-exist-jobid';
      const prev = JSON.stringify(teamState);

      const retval = teamState.updateByCreateJobId(jobId, { create: { jobStatus: JobStatus.FAILED } });
      expect(retval).toEqual(-1);
      expect(JSON.stringify(teamState)).toEqual(prev);
    });

    it('should only change one specific item matching jobId', () => {
      const expectedProjectName = getRandomPropertyValue(
        [...teamState.getProjects()].map(([_key, project]) => project),
        'projectName',
      );
      const jobId = teamState.getProjects().get(expectedProjectName)?.create?.jobId as string;
      const retval = teamState.updateByCreateJobId(jobId, { create: { jobStatus: JobStatus.DELIVERED } });
      expect(retval).toEqual(expectedProjectName);
      expect(teamState.getProjects().get(retval as string)?.create?.jobStatus).toEqual(JobStatus.DELIVERED);
    });
  });

  describe(TeamProjectsState.prototype.updateByExportJobId, () => {
    beforeEach(() => {
      dummyPopulateTeamProjectState(2, teamState, { export: { jobStatus: JobStatus.IN_PROGRESS } });
    });

    it('should return -1 and not change anything when specified jobId is not found', () => {
      const jobId = 'non-exist-jobid';
      const prev = JSON.stringify(teamState);

      const retval = teamState.updateByExportJobId(jobId, { create: { jobStatus: JobStatus.FAILED } });
      expect(retval).toEqual(-1);
      expect(JSON.stringify(teamState)).toEqual(prev);
    });

    it('should only change one specific item matching jobId', () => {
      const expectedProjectName = getRandomPropertyValue(
        [...teamState.getProjects()].map(([_key, project]) => project),
        'projectName',
      );
      const jobId = teamState.getProjects().get(expectedProjectName)?.export?.jobId as string;
      const retval = teamState.updateByExportJobId(jobId, { export: { jobStatus: JobStatus.DELIVERED } });
      expect(retval).toEqual(expectedProjectName);
      expect(teamState.getProjects().get(retval as string)?.export?.jobStatus).toEqual(JobStatus.DELIVERED);
    });
  });

  describe(TeamProjectsState.prototype.addOrUpdateByProjectName, () => {
    beforeEach(() => {
      dummyPopulateTeamProjectState(1, teamState, {
        updatedAt: 0,
        create: {
          jobStatus: JobStatus.DELIVERED,
          createdAt: 1234,
        },
        export: {
          jobStatus: JobStatus.FAILED,
          createdAt: 1234,
        },
      });
    });
    it('when updating, it should not squash / remove any existing properties', () => {
      const [_key, beforeUpdate] = Array.from(teamState.getProjects())[0];
      teamState.addOrUpdateByProjectName(beforeUpdate.projectName, {
        projectStatus: ProjectStatus.COMPLETE,
      });
      const afterUpdate = teamState.getProjects().get(beforeUpdate.projectName) as ProjectState;

      expect(afterUpdate.create?.createdAt).toEqual(beforeUpdate.create?.createdAt);
      expect(afterUpdate.create?.updatedAt).toEqual(beforeUpdate.create?.updatedAt); // should be the same because `state.create` was not updated
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
