export interface AssignmentConfig {
  labelers: string[];
  reviewers: string[];
  /**
   * @description whether the labelers and reviewers contain email or teamMemberId
   */
  useTeamMemberId?: boolean;
}

export interface DocumentAssignment {
  teamMemberId?: string | null;
  email?: string | null;
  documents?: DocumentFileNameWithPart[] | null;
  role?: ProjectAssignmentRole | null;
}

export interface DocumentFileNameWithPart {
  fileName: string;
  part: number;
}

export enum ProjectAssignmentRole {
  LABELER = 'LABELER',
  LABELER_AND_REVIEWER = 'LABELER_AND_REVIEWER',
  REVIEWER = 'REVIEWER',
}
