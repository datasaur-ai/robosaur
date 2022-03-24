export interface AssignmentConfig {
  labelers: string[];
  reviewers: string[];
  /**
   * @description whether to use team_member_id or not. Defaults to false (use email)
   */
  use_team_member_id?: boolean;
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
