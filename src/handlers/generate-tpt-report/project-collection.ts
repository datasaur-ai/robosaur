import { minBy } from 'lodash';
import moment from 'moment';
import { ProjectWithAssignment } from '../../datasaur/interfaces';

interface ProjectAssignmentRoleDictionary {
  [projectId: string]: {
    [userId: string]: string;
  };
}

interface ProjectCompletedDateDictionary {
  [projectId: string]: string | undefined;
}

export class ProjectCollection {
  private firstProject: ProjectWithAssignment | undefined = undefined;
  private projectCompletedDateDictionary: ProjectCompletedDateDictionary = {};
  private projectAssignmentRoleDictionary: ProjectAssignmentRoleDictionary = {};
  private projectIdsSet = new Set<string>();

  constructor(projects: ProjectWithAssignment[]) {
    this.initializeFirstProject(projects);
    this.initializeProjectCompletedDateDictionary(projects);
    this.initializeProjectAssignmentRoleDictionary(projects);
    this.initializeProjectIdsSet(projects);
  }

  getFirstProject(): ProjectWithAssignment | undefined {
    return this.firstProject;
  }

  getProjectCompletedDate(projectId: string): string | undefined {
    return this.projectCompletedDateDictionary[projectId];
  }

  getProjectAssignmentRole(projectId: string, userId: string): string | undefined {
    return this.projectAssignmentRoleDictionary[projectId]
      ? this.projectAssignmentRoleDictionary[projectId][userId]
      : undefined;
  }

  isProjectExist(projectId: string) {
    return this.projectIdsSet.has(projectId);
  }

  private initializeFirstProject(projects: ProjectWithAssignment[]) {
    this.firstProject = minBy(projects, (project) => moment(project.createdDate).unix());
  }

  private initializeProjectCompletedDateDictionary(projects: ProjectWithAssignment[]) {
    for (const project of projects) {
      this.projectCompletedDateDictionary[project.id] = project.completedDate;
    }
  }

  private initializeProjectAssignmentRoleDictionary(projects: ProjectWithAssignment[]) {
    for (const project of projects) {
      for (const assignment of project.assignees) {
        if (!assignment.teamMember.user) {
          continue;
        }

        this.projectAssignmentRoleDictionary[project.id] = {
          ...this.projectAssignmentRoleDictionary[project.id],
          [assignment.teamMember.user.id]: assignment.role,
        };
      }
    }
  }

  private initializeProjectIdsSet(projects: ProjectWithAssignment[]) {
    for (const project of projects) {
      this.projectIdsSet.add(project.id);
    }
  }
}
