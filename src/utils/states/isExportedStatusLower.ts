import { ProjectStatus } from '../../datasaur/interfaces';
import { ProjectState } from './interfaces';

export function isExportedStatusLower(state: ProjectState) {
  const exportedState = state.export?.statusOnLastExport as ProjectStatus;
  const currentState = state.projectStatus;

  return compareProjectStatus(exportedState, currentState);
}

function compareProjectStatus(firstStatus: ProjectStatus, secondStatus: ProjectStatus) {
  // behaves similarly to built-in String.compare
  // returns negative, 0, or positive
  // -1: firstStatus comes before secondStatus
  // 0 : exact macth
  // 1 : firstStatus comes after secondStatus

  const order = [
    ProjectStatus.CREATED,
    ProjectStatus.IN_PROGRESS,
    ProjectStatus.REVIEW_READY,
    ProjectStatus.IN_REVIEW,
    ProjectStatus.COMPLETE,
  ];

  return order.findIndex((s) => s === firstStatus) - order.findIndex((s) => s === secondStatus);
}
