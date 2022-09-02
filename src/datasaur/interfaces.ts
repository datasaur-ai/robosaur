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

export interface JSONAdvancedFormat {
  labels?: SpanLabel[];
  labelSets: LabelSet[] | undefined;
  sentences: JSONAdvancedSentenceFormat[];
}

export interface JSONAdvancedSentenceFormat {
  id: number;
  content: string;
  tokens: string[];
  metadata?: CellMetadata[];
}

export interface CellMetadata {
  key: string;
  value: string;
}

export enum LabelEntityType {
  ARROW = 'ARROW',
  SPAN = 'SPAN',
  BOUNDING_BOX = 'BOUNDING_BOX',
  QUESTION_BOUND = 'QUESTION_BOUND',
  TIMESTAMP = 'TIMESTAMP',
}

export interface SentenceLabel {
  id: string;
  l: string;
  layer: number;
  deleted?: boolean;
  labeledBy?: ConflictTextLabelResolutionStrategy;
  labeledByUserId?: number;
  start: TextCursor;
  end: TextCursor;
}

export interface SpanLabel {
  id: string;
  labelText: null;
  documentId: string;
  labeledByUserId?: number;
  startCellLine: number;
  startTokenIndex: number;
  startCharIndex: number;
  endCellIndex: number;
  endCellLine: number;
  endTokenIndex: number;
  endCharIndex: number;
  layer: number;
  labeledBy: ConflictTextLabelResolutionStrategy;
  acceptedByUserId?: number;
  rejectedByUserId?: number;
  type: LabelEntityType;
  labelSetItemId: string;
  status: LabelStatus;
  createdAt: string;
  updatedAt: string;
  hashCode: string;
  startTimestampMillis?: number;
  endTimestampMillis?: number;
}

export enum ConflictTextLabelResolutionStrategy {
  AUTO = 'AUTO',
  CONFLICT = 'CONFLICT',
  EXTERNAL = 'EXTERNAL',
  LABELER = 'LABELER',
  PRELABELED = 'PRELABELED',
  REVIEWER = 'REVIEWER',
}

export enum LabelStatus {
  LABELED = 'LABELED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface TextCursor {
  readonly sentenceId: number;
  readonly tokenId: number;
  readonly charId: number;
}
