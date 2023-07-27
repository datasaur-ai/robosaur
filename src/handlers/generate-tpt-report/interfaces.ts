export enum RowAnalyticEventType {
  ROW_BASED_ROW_LABELED = 'ROW_BASED_ROW_LABELED',
  ROW_HIGHLIGHTED = 'ROW_HIGHLIGHTED',
}

export enum RowAnalyticEventTargetType {
  CELL = 'CELL',
}

export interface RowAnalyticEvent {
  cell: {
    line: number;
    document: {
      id: string;
      fileName: string;
      project: {
        id: string;
        name: string;
      };
    };
  };
  createdAt: string;
  event: RowAnalyticEventType;
  id: string;
  user: {
    id: string;
    email: string;
    roleName: string;
  };
}

export interface RowAnalyticEventResponse {
  getRowAnalyticEvents: {
    pageInfo: { nextCursor: string };
    nodes: RowAnalyticEvent[];
  };
}

export interface RowReport {
  projectId: string;
  projectName: string;
  fileId: string;
  fileName: string;
  rowNumber: number;
  teamMember: string;
  role: string;
  projectAssignmentRole: string;
  startDate: string;
  endDate: string;
  duration: number;
}

export interface ReportDictionary {
  [documentId: string]: {
    [line: number]: {
      [userId: string]: RowReport | undefined;
    };
  };
}

export interface HighlightedDictionary {
  [documentId: string]: {
    [line: number]: {
      [userId: string]: RowAnalyticEvent | undefined;
    };
  };
}

export interface UnixTimestampRange {
  start: number;
  end: number;
}
