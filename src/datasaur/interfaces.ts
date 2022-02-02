export interface Project {
  id: string;
  name: string;
  tags: Tag[];
  status: ProjectStatus;
}

export interface Tag {
  id: string;
  name: string;
}

export interface LabelItem {
  id: string;
  parentId?: string | null;
  label: string;
  color?: string | null;
}

export interface LabelSet {
  label: string;
  config: {
    options: LabelItem[];
  };
}

export enum ExportFormat {
  XLSX = 'XLSX',
  CSV = 'CSV',
  TSV = 'TSV',
  TSV_NON_IOB = 'TSV_NON_IOB',
  JSON = 'JSON',
  JSON_TABULAR = 'JSON_TABULAR',
  JSON_ADVANCED = 'JSON_ADVANCED',
  PLAIN = 'PLAIN',
  CONLL_2003 = 'CONLL_2003',
  CONLL_U = 'CONLL_U',
  TSV_IOB = 'TSV_IOB',
  CUSTOM = 'CUSTOM',
}

export enum ProjectStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW_READY = 'REVIEW_READY',
  IN_REVIEW = 'IN_REVIEW',
  COMPLETE = 'COMPLETE',
}

export interface ExportResult {
  redirect: string | null;
  queued: boolean | null;
  fileUrl: string;
  fileUrlExpiredAt: string;
  exportId: string;
}
