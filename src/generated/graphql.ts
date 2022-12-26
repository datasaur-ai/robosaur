export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * Example of RowAnswer for one line
   *
   * Given a question set with 13 root questions, on a row labeling project with 4 columns of data:
   * meta.id=4 -> text, single answer.
   * meta.id=5 -> text, multiple answer.
   * meta.id=6 -> multiline text, single answer.
   * meta.id=7 -> multiline text, multiple answer.
   * meta.id=8 -> dropdown, multiple answer.
   * meta.id=9 -> dropdown, single answer.
   * meta.id=10 -> hierarchical dropdown, multiple answer.
   * meta.id=11 -> date.
   * meta.id=12 -> time.
   * meta.id=13 -> checkbox.
   * meta.id=14 -> slider.
   * meta.id=15 -> url.
   * meta.id=16 -> grouped attributes with 2 subfields (meta.id=17 and meta.id=18).
   * meta.id=17 -> text, single answer.
   * meta.id=18 -> checkbox.
   *
   * With such question set, the JSON object for one row of answer would look like this
   * The key for a RowAnswer object is ('Q' + question.meta.id)
   * {
   *   "Q4": "Short text",
   *   "Q5": [
   *     "Short text 1",
   *     "Short text 2",
   *     "Short text 3"
   *   ],
   *   "Q6": "Longer text at line 1\nMore text at line 2",
   *   "Q7": [
   *     "Longer text at line 1\nMore text at line 2",
   *     "Second longer text",
   *     "Third longer text"
   *   ],
   *   "Q8": [
   *     "Option 1",
   *     "Option 2"
   *   ],
   *   "Q9": "Option 1",
   *   "Q10": [
   *     "1.2",
   *     "3"
   *   ],
   *   "Q11": "2022-03-08",
   *   "Q12": "11:02:50.896",
   *   "Q13": true,
   *   "Q14": "6",
   *   "Q15": "https://datasaur.ai",
   *   "Q16": [
   *     {
   *       "Q17": "Nested short text, group 1",
   *       "Q18": true
   *     },
   *     {
   *       "Q17": "Nested short text, group 2",
   *       "Q18": false
   *     }
   *   ]
   * }
   */
  AnswerScalar: any;
  CellScalar: any;
  ConflictAnswerScalar: any;
  ConflictTextLabelScalar: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /**
   * interface ExportFileTransformerExecuteResult {
   *   document: ExportedDocument!
   * }
   */
  ExportFileTransformerExecuteResult: any;
  ExportableJSON: any;
  /**
   * interface ImportFileTransformerExecuteResult {
   *   document: ImportedDocument!
   *   labelSets: [ImportedLabelSet!]!
   * }
   */
  ImportFileTransformerExecuteResult: any;
  JobErrorArgs: any;
  JobResult: any;
  KeyPayload: any;
  TextLabelScalar: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum Action {
  ConfigureAppSettings = 'CONFIGURE_APP_SETTINGS',
  ConfigureAssistedLabeling = 'CONFIGURE_ASSISTED_LABELING',
  CreateTeam = 'CREATE_TEAM',
  ImportTokenLabel = 'IMPORT_TOKEN_LABEL',
  Internal = 'INTERNAL'
}

export type AddActiveDurationInput = {
  documentId: Scalars['ID'];
  durationMillis: Scalars['Int'];
};

export type AddFileToDatasetInput = {
  datasetId: Scalars['ID'];
  documentId: Scalars['ID'];
  extension: Scalars['String'];
  file: Scalars['Upload'];
};

export type AddLabelingFunctionInput = {
  content: Scalars['String'];
  dataProgrammingId: Scalars['ID'];
  name: Scalars['String'];
};

export type AnalyticsDashboardQueryInput = {
  calendarDate?: InputMaybe<Scalars['String']>;
  labelSetFilter?: InputMaybe<Array<Scalars['String']>>;
  labelType?: InputMaybe<AnalyticsLabelType>;
  projectId?: InputMaybe<Scalars['ID']>;
  teamId: Scalars['ID'];
  userId?: InputMaybe<Scalars['ID']>;
};

export enum AnalyticsLabelType {
  DocumentBased = 'DOCUMENT_BASED',
  TokenOrRowBased = 'TOKEN_OR_ROW_BASED'
}

export type Answer = {
  __typename?: 'Answer';
  key: Scalars['ID'];
  nestedAnswers?: Maybe<Array<Answer>>;
  values?: Maybe<Array<AnswerObject>>;
};

export type AnswerObject = {
  __typename?: 'AnswerObject';
  key: Scalars['String'];
  value: Scalars['String'];
};

export enum AnswerType {
  Multiple = 'MULTIPLE',
  Nested = 'NESTED'
}

/** Parameters to add new labelset item to existing labelset. */
export type AppendLabelSetTagItemsInput = {
  /** Optional. Defaults to false. */
  arrowLabelRequired?: InputMaybe<Scalars['Boolean']>;
  /** Required. The labelset to modify. */
  labelSetId: Scalars['ID'];
  /** Optional. The labelset's signature. */
  labelSetSignature?: InputMaybe<Scalars['String']>;
  /** Required. List of new items to add. */
  tagItems: Array<AppendTagItemInput>;
};

/** Representation of a new labelset item. */
export type AppendTagItemInput = {
  /** Optional. Only has effect if type is ARROW. */
  arrowRules?: InputMaybe<Array<LabelClassArrowRuleInput>>;
  /** Optional. The labelset item color when shown in web UI. 6 digit hex string, prefixed by #. Example: #df3920. */
  color?: InputMaybe<Scalars['String']>;
  /** Optional. Description of the labelset item. */
  desc?: InputMaybe<Scalars['String']>;
  /** Optional. Unique identifier of the labelset item. If not supplied, will be generated automatically. */
  id?: InputMaybe<Scalars['ID']>;
  /**
   * Required. The labelset item name, shown in web UI.
   * Note that `tagName` is case-insensitive, i.e. `per` is treated the same way as `PER` would.
   */
  tagName: Scalars['String'];
  /** Optional. Can be SPAN, ARROW, or ALL. Defaults to ALL. */
  type?: InputMaybe<LabelClassType>;
};

export type AssignProjectInput = {
  assignees: Array<ProjectAssignmentInput>;
  projectId: Scalars['ID'];
};

export type AutoLabelModel = {
  __typename?: 'AutoLabelModel';
  name: Scalars['String'];
  privacy: GqlAutoLabelModelPrivacy;
  provider: GqlAutoLabelServiceProvider;
};

export type AutoLabelModelsInput = {
  documentId: Scalars['ID'];
  kind: ProjectKind;
};

export type AutoLabelProjectOptionsInput = {
  numberOfFilesPerRequest: Scalars['Int'];
  serviceProvider?: InputMaybe<GqlAutoLabelServiceProvider>;
};

export type AutoLabelReviewTextDocumentBasedOnConsensusInput = {
  textDocumentId: Scalars['ID'];
};

export type AutoLabelRowBasedInput = {
  documentId: Scalars['ID'];
  rowIdRange?: InputMaybe<RangeInput>;
};

export type AutoLabelRowBasedOutput = {
  __typename?: 'AutoLabelRowBasedOutput';
  id: Scalars['Int'];
  label: Scalars['String'];
};

export type AutoLabelTokenBasedInput = {
  documentId: Scalars['ID'];
  sentenceIdRange?: InputMaybe<RangeInput>;
  sentenceIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type AutoLabelTokenBasedOutput = {
  __typename?: 'AutoLabelTokenBasedOutput';
  confidenceScore?: Maybe<Scalars['Float']>;
  deleted?: Maybe<Scalars['Boolean']>;
  end: TextCursor;
  label: Scalars['String'];
  layer?: Maybe<Scalars['Int']>;
  start: TextCursor;
};

export type AutoLabelTokenBasedProjectInput = {
  labelerEmail: Scalars['String'];
  options: AutoLabelProjectOptionsInput;
  projectId: Scalars['ID'];
  role?: InputMaybe<Role>;
  targetAPI: TargetApiInput;
};

export type AutoLabelTokenBasedProjectOutput = {
  __typename?: 'AutoLabelTokenBasedProjectOutput';
  result: Scalars['Boolean'];
};

export enum AutomationActivityDetailStatus {
  Failure = 'FAILURE',
  Success = 'SUCCESS'
}

export enum AutomationType {
  ProjectCreation = 'PROJECT_CREATION'
}

export type AwsMarketplaceSubscriptionInput = {
  action: Scalars['String'];
  customerId: Scalars['ID'];
  productCode: Scalars['String'];
};

export type BBoxLabel = {
  __typename?: 'BBoxLabel';
  bboxLabelClassId: Scalars['ID'];
  caption?: Maybe<Scalars['String']>;
  deleted: Scalars['Boolean'];
  documentId: Scalars['ID'];
  /** The hashCode of this label. */
  id: Scalars['ID'];
  shapes: Array<BBoxShape>;
};

export type BBoxLabelClass = {
  __typename?: 'BBoxLabelClass';
  captionAllowed: Scalars['Boolean'];
  captionRequired: Scalars['Boolean'];
  color?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type BBoxLabelClassInput = {
  captionAllowed: Scalars['Boolean'];
  captionRequired: Scalars['Boolean'];
  color?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type BBoxLabelInput = {
  bboxLabelClassId: Scalars['ID'];
  caption?: InputMaybe<Scalars['String']>;
  documentId: Scalars['ID'];
  /** Optional. The hashCode of this label. */
  id?: InputMaybe<Scalars['ID']>;
  shapes: Array<BBoxShapeInput>;
};

export type BBoxLabelSet = {
  __typename?: 'BBoxLabelSet';
  classes: Array<BBoxLabelClass>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type BBoxLabelSetInput = {
  classes: Array<BBoxLabelClassInput>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type BBoxLabelSetProjectInput = {
  name: Scalars['String'];
  options: Array<BBoxLabelClassInput>;
};

export type BBoxPoint = {
  __typename?: 'BBoxPoint';
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type BBoxPointInput = {
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type BBoxShape = {
  __typename?: 'BBoxShape';
  pageIndex: Scalars['Int'];
  points: Array<BBoxPoint>;
};

export type BBoxShapeInput = {
  pageIndex: Scalars['Int'];
  points: Array<BBoxPointInput>;
};

export type BoundingBoxLabel = {
  __typename?: 'BoundingBoxLabel';
  coordinates: Array<Coordinate>;
  counter: Scalars['Int'];
  documentId: Scalars['ID'];
  hashCode: Scalars['String'];
  id: Scalars['ID'];
  labeledBy: LabelPhase;
  layer: Scalars['Int'];
  pageIndex: Scalars['Int'];
  position: TextRange;
  type: LabelEntityType;
};

export type BoundingBoxLabelInput = {
  coordinates: Array<CoordinateInput>;
  counter: Scalars['Int'];
  labeledBy?: InputMaybe<LabelPhase>;
  layer: Scalars['Int'];
  pageIndex?: InputMaybe<Scalars['Int']>;
  position: TextRangeInput;
};

export type BoundingBoxPage = {
  __typename?: 'BoundingBoxPage';
  pageHeight: Scalars['Int'];
  pageIndex: Scalars['Int'];
  pageWidth: Scalars['Int'];
};

export type Cabinet = {
  __typename?: 'Cabinet';
  documents: Array<TextDocument>;
  id: Scalars['ID'];
  lastOpenedDocumentId?: Maybe<Scalars['ID']>;
  role: Role;
  statistic?: Maybe<CabinetStatistic>;
  status: CabinetStatus;
};

export type CabinetDocumentIds = {
  __typename?: 'CabinetDocumentIds';
  cabinetId: Scalars['Int'];
  documentIds: Array<Scalars['String']>;
};

export type CabinetDocumentIdsInput = {
  cabinetId: Scalars['Int'];
  documentIds: Array<Scalars['String']>;
};

export type CabinetStatistic = {
  __typename?: 'CabinetStatistic';
  id: Scalars['ID'];
  numberOfLines: Scalars['Int'];
  numberOfTokens: Scalars['Int'];
};

export enum CabinetStatus {
  Complete = 'COMPLETE',
  InProgress = 'IN_PROGRESS'
}

export type CalculateReviewStatisticInput = {
  chunkIds?: InputMaybe<Array<Scalars['Int']>>;
  documentId: Scalars['ID'];
};

export type Cell = {
  __typename?: 'Cell';
  conflict: Scalars['Boolean'];
  conflicts?: Maybe<Array<CellConflict>>;
  content: Scalars['String'];
  index: Scalars['Int'];
  line: Scalars['Int'];
  metadata: Array<CellMetadata>;
  originCell?: Maybe<Cell>;
  status: CellStatus;
  tokens: Array<Scalars['String']>;
};

export type CellConflict = {
  __typename?: 'CellConflict';
  cell: Cell;
  documentId: Scalars['ID'];
  labelerId: Scalars['Int'];
  labels: Array<TextLabel>;
};

export type CellInput = {
  content: Scalars['String'];
  index: Scalars['Int'];
  line: Scalars['Int'];
  metadata: Array<CellMetadataInput>;
  tokens: Array<Scalars['String']>;
};

export type CellMetadata = {
  __typename?: 'CellMetadata';
  config?: Maybe<TextMetadataConfig>;
  key: Scalars['String'];
  pinned?: Maybe<Scalars['Boolean']>;
  type?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type CellMetadataInput = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export type CellPositionWithOriginDocumentId = {
  __typename?: 'CellPositionWithOriginDocumentId';
  index: Scalars['Int'];
  line: Scalars['Int'];
  originDocumentId: Scalars['ID'];
};

export type CellPositionWithOriginDocumentIdInput = {
  index: Scalars['Int'];
  line: Scalars['Int'];
  originDocumentId: Scalars['ID'];
};

export enum CellStatus {
  Deleted = 'DELETED',
  Displayed = 'DISPLAYED',
  Hidden = 'HIDDEN'
}

export type Chart = {
  __typename?: 'Chart';
  dataTableHeaders: Array<Scalars['String']>;
  description: Scalars['String'];
  id: Scalars['ID'];
  level: ChartLevel;
  name: Scalars['String'];
  type: ChartType;
  visualizationParams: VisualizationParams;
};

export type ChartArea = {
  __typename?: 'ChartArea';
  left: Scalars['String'];
  width: Scalars['String'];
};

export type ChartDataRow = {
  __typename?: 'ChartDataRow';
  key: Scalars['String'];
  keyPayload?: Maybe<Scalars['KeyPayload']>;
  keyPayloadType?: Maybe<KeyPayloadType>;
  values: Array<ChartDataRowValue>;
};

export type ChartDataRowValue = {
  __typename?: 'ChartDataRowValue';
  key: Scalars['String'];
  value: Scalars['String'];
};

export enum ChartLevel {
  Project = 'PROJECT',
  Team = 'TEAM',
  TeamMemberAsLabeler = 'TEAM_MEMBER_AS_LABELER',
  TeamMemberAsReviewer = 'TEAM_MEMBER_AS_REVIEWER'
}

export enum ChartType {
  Grouped = 'GROUPED',
  Simple = 'SIMPLE',
  Table = 'TABLE'
}

export type ClearAllLabelsOnTextDocumentResult = {
  __typename?: 'ClearAllLabelsOnTextDocumentResult';
  affectedChunkIds: Array<Scalars['Int']>;
  lastSavedAt: Scalars['String'];
  statistic: TextDocumentStatistic;
};

export type CollectDatasetInput = {
  mlModelSettingId: Scalars['ID'];
  teamId: Scalars['ID'];
  version: Scalars['Int'];
};

export type ColorGradient = {
  __typename?: 'ColorGradient';
  max: Scalars['String'];
  min: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  commentedContent?: Maybe<CommentedContent>;
  createdAt: Scalars['String'];
  documentId: Scalars['ID'];
  hashCode?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  message: Scalars['String'];
  originDocumentId: Scalars['ID'];
  parentId?: Maybe<Scalars['ID']>;
  repliesCount: Scalars['Int'];
  resolved: Scalars['Boolean'];
  resolvedAt?: Maybe<Scalars['String']>;
  resolvedBy?: Maybe<User>;
  updatedAt: Scalars['String'];
  user: User;
  userId: Scalars['Int'];
};

export type CommentedContent = {
  __typename?: 'CommentedContent';
  contexts: Array<CommentedContentContextValue>;
  currentValue?: Maybe<Array<CommentedContentCurrentValue>>;
  hashCodeType: Scalars['String'];
};

export type CommentedContentContextValue = {
  __typename?: 'CommentedContentContextValue';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type CommentedContentCurrentValue = {
  __typename?: 'CommentedContentCurrentValue';
  sentenceId: Scalars['Int'];
  sentenceText: Scalars['String'];
};

export type ConflictAnswer = {
  __typename?: 'ConflictAnswer';
  answers: Array<ConflictAnswerValue>;
  nestedAnswerIndex?: Maybe<Scalars['Int']>;
  parentQuestionId?: Maybe<Scalars['ID']>;
  questionId: Scalars['ID'];
  type: AnswerType;
};

export type ConflictAnswerSentence = {
  __typename?: 'ConflictAnswerSentence';
  conflictAnswerResolved?: Maybe<ConflictTextLabelResolutionStrategy>;
  documentId: Scalars['ID'];
  id: Scalars['Int'];
  labelerIds: Array<Scalars['Int']>;
};

export type ConflictAnswerValue = {
  __typename?: 'ConflictAnswerValue';
  resolved?: Maybe<Scalars['Boolean']>;
  userIds: Array<Scalars['ID']>;
  users: Array<User>;
  value: Scalars['String'];
};

export type ConflictBoundingBoxLabel = {
  __typename?: 'ConflictBoundingBoxLabel';
  coordinates: Array<Coordinate>;
  documentId: Scalars['ID'];
  hashCode: Scalars['String'];
  id: Scalars['ID'];
  labelerIds: Array<Scalars['Int']>;
  layer: Scalars['Int'];
  pageIndex: Scalars['Int'];
  position: TextRange;
  resolved: Scalars['Boolean'];
  text: Scalars['String'];
};

export type ConflictContributorIds = {
  __typename?: 'ConflictContributorIds';
  contributorIds: Array<Scalars['Int']>;
  labelHashCode: Scalars['String'];
};

export type ConflictResolution = {
  __typename?: 'ConflictResolution';
  consensus: Scalars['Int'];
  mode: ConflictResolutionMode;
};

export type ConflictResolutionInput = {
  /** Peer review / labeler consensus. It determines how many consensus so that the label will be automatically accepted. */
  consensus?: InputMaybe<Scalars['Int']>;
  /**
   * Defaults to PEER_REVIEW when not provided.
   * MANUAL: all labels must be manually accepted / rejected by REVIEWERs
   * PEER_REVIEW: labels that have met the minimum consensus value are automatically accepted.
   */
  mode?: InputMaybe<ConflictResolutionMode>;
};

export enum ConflictResolutionMode {
  Manual = 'MANUAL',
  PeerReview = 'PEER_REVIEW'
}

export type ConflictTextLabel = {
  __typename?: 'ConflictTextLabel';
  documentId?: Maybe<Scalars['String']>;
  end: TextCursor;
  hashCode: Scalars['String'];
  id: Scalars['ID'];
  l: Scalars['String'];
  labelerIds?: Maybe<Array<Scalars['Int']>>;
  labelers?: Maybe<Array<User>>;
  layer: Scalars['Int'];
  ref: Scalars['String'];
  resolved: Scalars['Boolean'];
  start: TextCursor;
  text?: Maybe<Scalars['String']>;
};

export enum ConflictTextLabelResolutionStrategy {
  Auto = 'AUTO',
  Conflict = 'CONFLICT',
  External = 'EXTERNAL',
  Labeler = 'LABELER',
  Prelabeled = 'PRELABELED',
  Reviewer = 'REVIEWER'
}

export type Coordinate = {
  __typename?: 'Coordinate';
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type CoordinateInput = {
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type CreateCustomApiInput = {
  endpointURL: Scalars['String'];
  name: Scalars['String'];
  purpose: CustomApiPurpose;
  secret: Scalars['String'];
};

export type CreateExternalObjectStorageInput = {
  bucketName: Scalars['String'];
  cloudService: ObjectStorageClientName;
  credentials: ExternalObjectStorageCredentialsInput;
  teamId: Scalars['ID'];
};

export type CreateFileTransformerInput = {
  name: Scalars['String'];
  purpose: FileTransformerPurpose;
  teamId: Scalars['ID'];
};

export type CreateLabelSetInput = {
  /** Optional. Defaults to false. */
  arrowLabelRequired?: InputMaybe<Scalars['Boolean']>;
  /**
   * The labelset's zero-based index in a project.
   * Each project can have up to 5 labelset.
   */
  index?: InputMaybe<Scalars['Int']>;
  /** The labelset's name. */
  name?: InputMaybe<Scalars['String']>;
  /** List of labelset items to be added under the new labelset. */
  tagItems: Array<TagItemInput>;
};

/** Representation of a new labelset template. */
export type CreateLabelSetTemplateInput = {
  /** Required. The labelset template's name. */
  name: Scalars['String'];
  /**
   * Required. The items to be added into the new labelset template.
   * To create a token-based labelset template, put the list of labelset items under `questions[0].config.options` field.
   */
  questions: Array<LabelSetTemplateItemInput>;
  /** Optional. Associate the labelset template to the specified team. See type `Team`. */
  teamId?: InputMaybe<Scalars['ID']>;
};

export type CreatePersonalTagInput = {
  name: Scalars['String'];
};

export type CreateProjectInput = {
  assignees?: InputMaybe<Array<ProjectAssignmentByNameInput>>;
  document: Scalars['Upload'];
  externalObjectStorageId?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  purpose: ProjectPurpose;
  tagNames?: InputMaybe<Array<Scalars['String']>>;
  teamId?: InputMaybe<Scalars['ID']>;
  type: Scalars['String'];
};

export type CreateProjectTemplateInput = {
  logo?: InputMaybe<Scalars['Upload']>;
  name: Scalars['String'];
  projectId: Scalars['ID'];
};

export type CreateQuestionSetInput = {
  items: Array<QuestionSetItemInput>;
  name: Scalars['String'];
  teamId?: InputMaybe<Scalars['String']>;
};

export type CreateTagInput = {
  name: Scalars['String'];
  teamId?: InputMaybe<Scalars['ID']>;
};

export type CreateTagsIfNotExistInput = {
  names: Array<Scalars['String']>;
  teamId?: InputMaybe<Scalars['ID']>;
};

export type CreateTeamInput = {
  logo?: InputMaybe<Scalars['Upload']>;
  members?: InputMaybe<Array<TeamMemberInput>>;
  name: Scalars['String'];
};

export type CreateTextDocumentInput = {
  answerExternalImportableUrl?: InputMaybe<Scalars['String']>;
  answerFile?: InputMaybe<Scalars['Upload']>;
  answerFileName?: InputMaybe<Scalars['String']>;
  customTextExtractionAPIId?: InputMaybe<Scalars['ID']>;
  /** Only used in Row Based Labeling and Document Based Labeling. */
  docFileOptions?: InputMaybe<DocFileOptionsInput>;
  externalImportableUrl?: InputMaybe<Scalars['String']>;
  /** Specify this if you want to select a pre-labeled file directly from your own object storage */
  externalObjectStorageAnswerFileKey?: InputMaybe<Scalars['String']>;
  /** Specify this if you want to select a file directly from your own object storage */
  externalObjectStorageFileKey?: InputMaybe<Scalars['String']>;
  extraFiles?: InputMaybe<Array<Scalars['Upload']>>;
  /** Specify `file` if you want to upload file. Datasaur only process one between `file` and `fileUrl`s. */
  file?: InputMaybe<Scalars['Upload']>;
  /** Required. File Name. It affects the File Extension and exported file. */
  fileName: Scalars['String'];
  fileTransformerId?: InputMaybe<Scalars['ID']>;
  /** Specify `fileUrl` if you want to label document from external datasaur without uploading the content. Datasaur only process one between `file` and `fileUrl`s. */
  fileUrl?: InputMaybe<Scalars['String']>;
  /** Document Name. It affects the document title section. */
  name?: InputMaybe<Scalars['String']>;
  questionFile?: InputMaybe<Scalars['Upload']>;
  questionFileName?: InputMaybe<Scalars['String']>;
  settings?: InputMaybe<SettingsInput>;
  /** Optional. It uses the same type as in LaunchTextProjectInput. */
  type?: InputMaybe<TextDocumentType>;
};

export type CreateUserInput = {
  amazonId?: InputMaybe<Scalars['String']>;
  betaKey?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  googleId?: InputMaybe<Scalars['String']>;
  invitationKey?: InputMaybe<Scalars['String']>;
  oktaId?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  recaptcha?: InputMaybe<Scalars['String']>;
  redirect?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type CursorPageInput = {
  after?: InputMaybe<Scalars['Int']>;
  take: Scalars['Int'];
};

export type CustomApi = {
  __typename?: 'CustomAPI';
  endpointURL: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  purpose: CustomApiPurpose;
  teamId: Scalars['ID'];
};

export enum CustomApiPurpose {
  AsrApi = 'ASR_API',
  OcrApi = 'OCR_API'
}

export type CustomReportBuilderInput = {
  /** Optional. The filters. See `CustomReportFilter`. */
  filters?: InputMaybe<Array<CustomReportFilter>>;
  /** Required. The metrics group table ID to export. */
  metricsGroupId: Scalars['ID'];
  /** Required. The metrics to export. See `CustomReportMetric`. */
  selectedMetrics: Array<CustomReportMetric>;
  /** Required. The segments to export. See `CustomReportClientSegment`. */
  selectedSegments: Array<CustomReportClientSegment>;
};

export enum CustomReportClientSegment {
  Date = 'DATE',
  Document = 'DOCUMENT',
  DocumentCreatedAt = 'DOCUMENT_CREATED_AT',
  DocumentOrigin = 'DOCUMENT_ORIGIN',
  DocumentUpdatedAt = 'DOCUMENT_UPDATED_AT',
  Label = 'LABEL',
  LabelType = 'LABEL_TYPE',
  OwnerUser = 'OWNER_USER',
  Project = 'PROJECT',
  ProjectRole = 'PROJECT_ROLE',
  User = 'USER'
}

export type CustomReportFilter = {
  field: CustomReportFilterColumn;
  strategy: CustomReportFilterStrategy;
  value: Scalars['String'];
};

export enum CustomReportFilterColumn {
  Date = 'DATE',
  DocumentCreatedAt = 'DOCUMENT_CREATED_AT',
  DocumentName = 'DOCUMENT_NAME',
  DocumentOriginName = 'DOCUMENT_ORIGIN_NAME',
  DocumentUpdatedAt = 'DOCUMENT_UPDATED_AT',
  Label = 'LABEL',
  LabeledByUserDisplayName = 'LABELED_BY_USER_DISPLAY_NAME',
  LabelType = 'LABEL_TYPE',
  OwnerUserName = 'OWNER_USER_NAME',
  ProjectName = 'PROJECT_NAME',
  ProjectRole = 'PROJECT_ROLE',
  UserName = 'USER_NAME'
}

export enum CustomReportFilterStrategy {
  Contains = 'CONTAINS',
  Date = 'DATE',
  Is = 'IS',
  IsNot = 'IS_NOT',
  NotContains = 'NOT_CONTAINS'
}

export enum CustomReportMetric {
  LabelsAccuracy = 'LABELS_ACCURACY',
  TimeSpent = 'TIME_SPENT',
  TimeSpentPerLabel = 'TIME_SPENT_PER_LABEL',
  TotalConflicts = 'TOTAL_CONFLICTS',
  TotalConflictsResolved = 'TOTAL_CONFLICTS_RESOLVED',
  TotalLabelsAccepted = 'TOTAL_LABELS_ACCEPTED',
  TotalLabelsApplied = 'TOTAL_LABELS_APPLIED',
  TotalLabelsAppliedByLabeler = 'TOTAL_LABELS_APPLIED_BY_LABELER',
  TotalLabelsAppliedByReviewer = 'TOTAL_LABELS_APPLIED_BY_REVIEWER',
  TotalLabelsRejected = 'TOTAL_LABELS_REJECTED'
}

export type CustomReportMetricsGroupTable = {
  __typename?: 'CustomReportMetricsGroupTable';
  clientSegments: Array<CustomReportClientSegment>;
  description?: Maybe<Scalars['String']>;
  filterStrategies: Array<CustomReportFilterStrategy>;
  id: Scalars['ID'];
  metrics: Array<CustomReportMetric>;
  name: Scalars['String'];
};

export type DataProgramming = {
  __typename?: 'DataProgramming';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  labels: Array<DataProgrammingLabel>;
  labelsSignature: Scalars['String'];
  projectId: Scalars['ID'];
  provider: DataProgrammingProvider;
  updatedAt: Scalars['String'];
};

export type DataProgrammingLabel = {
  __typename?: 'DataProgrammingLabel';
  labelId: Scalars['Int'];
  labelName: Scalars['String'];
};

export type DataProgrammingLibraries = {
  __typename?: 'DataProgrammingLibraries';
  libraries: Array<Scalars['String']>;
};

export enum DataProgrammingProvider {
  Snorkel = 'SNORKEL',
  Stegosaurus = 'STEGOSAURUS'
}

export type Dataset = {
  __typename?: 'Dataset';
  cabinetIds?: Maybe<Array<CabinetDocumentIds>>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  kind: DatasetKind;
  labelCount: Scalars['Int'];
  mlModelSettingId: Scalars['ID'];
  teamId: Scalars['ID'];
  updatedAt?: Maybe<Scalars['String']>;
};

export type DatasetInput = {
  cabinets?: InputMaybe<Array<CabinetDocumentIdsInput>>;
  kind: DatasetKind;
  labelCount: Scalars['Int'];
  mlModelSettingId: Scalars['ID'];
  teamId: Scalars['ID'];
  version: Scalars['Int'];
};

export enum DatasetKind {
  DocumentBased = 'DOCUMENT_BASED',
  RowBased = 'ROW_BASED',
  TokenBased = 'TOKEN_BASED'
}

export type DatasetPaginatedResponse = PaginatedResponse & {
  __typename?: 'DatasetPaginatedResponse';
  nodes: Array<Dataset>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export enum DateTimeDefaultValue {
  Now = 'NOW'
}

export type DaysCreatedInput = {
  /** Required. Date string, in `yyyy-mm-dd`. */
  newestDate: Scalars['String'];
  /** Date string, in `yyyy-mm-dd`. */
  oldestDate?: InputMaybe<Scalars['String']>;
};

export type DefinitionEntry = {
  __typename?: 'DefinitionEntry';
  definition: Scalars['String'];
  synonyms?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type DeleteExtensionElementInput = {
  cabinetId: Scalars['String'];
  id: Scalars['String'];
};

export type DeleteLabelsOnTextDocumentInput = {
  documentId: Scalars['ID'];
  tagItemIds: Array<Scalars['ID']>;
};

export type DeleteLabelsOnTextDocumentResult = {
  __typename?: 'DeleteLabelsOnTextDocumentResult';
  affectedChunks: Array<TextChunk>;
  deletedTokenLabels: Array<TextLabel>;
  lastSavedAt: Scalars['String'];
  statistic: TextDocumentStatistic;
};

export type DeleteProjectInput = {
  projectId: Scalars['ID'];
};

export type DeleteSentenceResult = {
  __typename?: 'DeleteSentenceResult';
  addedLabels: Array<TextLabel>;
  deletedLabels: Array<TextLabel>;
  document: TextDocument;
  updatedCell: Cell;
};

export type DeleteTextDocumentResult = {
  __typename?: 'DeleteTextDocumentResult';
  id?: Maybe<Scalars['ID']>;
};

export type DictionaryResult = {
  __typename?: 'DictionaryResult';
  entries: Array<Maybe<DictionaryResultEntry>>;
  lang: Scalars['String'];
  word: Scalars['String'];
};

export type DictionaryResultEntry = {
  __typename?: 'DictionaryResultEntry';
  definitions: Array<DefinitionEntry>;
  lexicalCategory: Scalars['String'];
};

export type DocFileOptionsInput = {
  /** Override column headers by using these values. */
  customHeaderColumns?: InputMaybe<Array<HeaderColumnInput>>;
  /** If the csv or xlsx file has header as the first row. Datasaur will use it as the column header for Row Based Labeling. */
  firstRowAsHeader?: InputMaybe<Scalars['Boolean']>;
};

export type DocLabelObject = {
  __typename?: 'DocLabelObject';
  labels: Array<Scalars['String']>;
  objectLabels?: Maybe<Array<LabelObject>>;
  subLabels?: Maybe<Array<DocLabelObject>>;
};

export type DocLabelObjectInput = {
  labels: Array<Scalars['String']>;
  objectLabels?: InputMaybe<Array<LabelObjectInput>>;
  subLabels?: InputMaybe<Array<DocLabelObjectInput>>;
};

/**
 * Example of DocumentAnswer for one document
 *
 * Given a question set with 13 root questions, on a row labeling project with 4 columns of data:
 * question.index=0 -> text, single answer.
 * question.index=1 -> text, multiple answer.
 * question.index=2 -> multiline text, single answer.
 * question.index=3 -> multiline text, multiple answer.
 * question.index=4 -> dropdown, multiple answer.
 * question.index=5 -> dropdown, single answer.
 * question.index=6 -> hierarchical dropdown, multiple answer.
 * question.index=7 -> date.
 * question.index=8 -> time.
 * question.index=9 -> checkbox.
 * question.index=10 -> slider.
 * question.index=11 -> url.
 * question.index=12 -> grouped attributes with 2 subfields (question.index=13 and question.index=14).
 * question.index=13 -> text, single answer.
 * question.index=14 -> checkbox.
 *
 * The key for a DocumentAnswer object is ('Q' + question.index)
 * {
 *   "Q0": "Short text",
 *   "Q1": [
 *     "Short text 1",
 *     "Short text 2",
 *     "Short text 3"
 *   ],
 *   "Q2": "Longer text at line 1\nMore text at line 2",
 *   "Q3": [
 *     "Longer text at line 1\nMore text at line 2",
 *     "Second longer text",
 *     "Third longer text"
 *   ],
 *   "Q4": [
 *     "Option 1",
 *     "Option 2"
 *   ],
 *   "Q5": "Option 1",
 *   "Q6": [
 *     "1.2",
 *     "3"
 *   ],
 *   "Q7": "2022-03-08",
 *   "Q8": "11:02:50.896",
 *   "Q9": true,
 *   "Q10": "6",
 *   "Q11": "https://datasaur.ai",
 *   "Q12": [
 *     {
 *       "Q13": "Nested short text, group 1",
 *       "Q14": true
 *     },
 *     {
 *       "Q13": "Nested short text, group 2",
 *       "Q14": false
 *     }
 *   ]
 * }
 */
export type DocumentAnswer = {
  __typename?: 'DocumentAnswer';
  answers: Scalars['AnswerScalar'];
  documentId: Scalars['ID'];
};

export type DocumentAssignmentInput = {
  /** List of documents to be assigned. */
  documents?: InputMaybe<Array<DocumentFileNameWithPart>>;
  /** One of `teamMemberId` or `email` must be provided. */
  email?: InputMaybe<Scalars['String']>;
  /** The team member's role in the document. */
  role?: InputMaybe<ProjectAssignmentRole>;
  /** One of `teamMemberId` or `email` must be provided. See query `getTeamMembers` to get `teamMemberId`s. */
  teamMemberId?: InputMaybe<Scalars['ID']>;
};

export type DocumentBoundLabel = {
  __typename?: 'DocumentBoundLabel';
  answerPath: Scalars['String'];
  document: TextDocument;
  documentId: Scalars['String'];
  hashCode: Scalars['String'];
  id: Scalars['Int'];
  label: Scalars['String'];
  questionId: Scalars['Int'];
};

export type DocumentBoundLabelConflict = {
  __typename?: 'DocumentBoundLabelConflict';
  conflictable: DocumentBoundLabel;
  documentId: Scalars['String'];
  labelers: Array<User>;
  resolved: Scalars['Boolean'];
};

export type DocumentBoundLabelInput = {
  answerPath: Scalars['String'];
  documentId: Scalars['String'];
  label: Scalars['String'];
  questionId: Scalars['Int'];
};

export type DocumentFileNameWithPart = {
  /** Required. The uploaded document filename. */
  fileName: Scalars['String'];
  /**
   * Required. Zero-index numbering up to the limit set in `SplitDocumentOptionInput.number`.
   * Example: if the limit is `3`, part should be `0`, `1` and `2`.
   * Set this to `0` and `SplitDocumentOptionInput` to `null` to skip splitting the document.
   */
  part: Scalars['Int'];
};

export type DocumentFinalReport = {
  __typename?: 'DocumentFinalReport';
  cabinet: Cabinet;
  document: TextDocument;
  finalReport: FinalReport;
  rowFinalReports?: Maybe<Array<RowFinalReport>>;
  teamMember?: Maybe<TeamMember>;
};

export type DocumentForPredictionInput = {
  documentId: Scalars['String'];
  lineIndexEnd: Scalars['Int'];
  lineIndexStart: Scalars['Int'];
};

export type DocumentMeta = {
  __typename?: 'DocumentMeta';
  cabinetId: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  displayed: Scalars['Boolean'];
  format?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  labelerRestricted: Scalars['Boolean'];
  multipleChoice: Scalars['Boolean'];
  name: Scalars['String'];
  options?: Maybe<Array<DocumentMetaOption>>;
  required: Scalars['Boolean'];
  type: QuestionType;
  width?: Maybe<Scalars['String']>;
};

export type DocumentMetaInput = {
  delete?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  displayed?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  labelerRestricted?: InputMaybe<Scalars['Boolean']>;
  multipleChoice?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  options?: InputMaybe<Array<DocumentMetaOptionInput>>;
  required?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<QuestionType>;
  width?: InputMaybe<Scalars['String']>;
};

export type DocumentMetaOption = {
  __typename?: 'DocumentMetaOption';
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  parentId?: Maybe<Scalars['ID']>;
};

export type DocumentMetaOptionInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  parentId?: InputMaybe<Scalars['ID']>;
};

export type DropdownConfigOptions = {
  __typename?: 'DropdownConfigOptions';
  id: Scalars['ID'];
  label: Scalars['String'];
  parentId?: Maybe<Scalars['ID']>;
};

export type DropdownConfigOptionsInput = {
  id: Scalars['ID'];
  label: Scalars['String'];
  parentId?: InputMaybe<Scalars['ID']>;
};

export type EditSentenceConflict = {
  __typename?: 'EditSentenceConflict';
  documentId: Scalars['String'];
  fileName: Scalars['String'];
  lines: Array<Scalars['Int']>;
};

export type EditSentenceInput = {
  documentId: Scalars['ID'];
  sentenceId: Scalars['Int'];
  signature: Scalars['String'];
  text: Scalars['String'];
  tokenizationMethod?: InputMaybe<TokenizationMethod>;
};

export type EditSentenceResult = {
  __typename?: 'EditSentenceResult';
  addedBoundingBoxLabels: Array<BoundingBoxLabel>;
  addedLabels: Array<GqlConflictable>;
  deletedBoundingBoxLabels: Array<BoundingBoxLabel>;
  deletedLabels: Array<GqlConflictable>;
  document: TextDocument;
  previousSentences: Array<TextSentence>;
  updatedCell: Cell;
};

export type EnableExtensionElementsInput = {
  enabled?: InputMaybe<Scalars['Boolean']>;
  extensionId: Scalars['ID'];
};

export type EnableProjectExtensionElementsInput = {
  cabinetId: Scalars['ID'];
  elements: Array<EnableExtensionElementsInput>;
};

export enum ExportChartMethod {
  Email = 'EMAIL',
  FileStorage = 'FILE_STORAGE'
}

export enum ExportCommentType {
  ArrowLabel = 'ARROW_LABEL',
  Comment = 'COMMENT',
  SpanLabel = 'SPAN_LABEL',
  SpanText = 'SPAN_TEXT'
}

export enum ExportDeliveryStatus {
  Delivered = 'DELIVERED',
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  None = 'NONE',
  Queued = 'QUEUED'
}

/** The result / payload received after initiating an export query. */
export type ExportRequestResult = {
  __typename?: 'ExportRequestResult';
  /** The export process ID. Used to check the delivery status via `getExportDeliveryStatus`, `getJob` or `getJobs`. */
  exportId: Scalars['ID'];
  /** Link to download the exported file. Should be used when choosing `FILE_STORAGE`. */
  fileUrl?: Maybe<Scalars['String']>;
  fileUrlExpiredAt?: Maybe<Scalars['String']>;
  queued?: Maybe<Scalars['Boolean']>;
  /** You should use this redirect url if you use method `DOWNLOAD`. */
  redirect?: Maybe<Scalars['String']>;
};

export type ExportTeamOverviewInput = {
  /** Required. How the export result is delivered. */
  method: GqlExportMethod;
  /** Optional. Use this field when you choose method `CUSTOM_WEBHOOK`. */
  secret?: InputMaybe<Scalars['String']>;
  /** Required. The team ID to export. See `getAllTeams`. */
  teamId: Scalars['String'];
  /** Optional. Use this field when you choose method `CUSTOM_WEBHOOK`. */
  url?: InputMaybe<Scalars['String']>;
};

export type ExportTestProjectResultInput = {
  /** Optional. Use this field when you choose method `EXTERNAL_FILE_STORAGE`. */
  externalFileStorageParameter?: InputMaybe<ExternalFileStorageInput>;
  /** Required. How the export result is delivered. */
  method: GqlExportMethod;
  /** Required. The project ID to export. See `getProjects`. */
  projectId: Scalars['String'];
  /** Optional. Use this field when you choose method `CUSTOM_WEBHOOK`. */
  secret?: InputMaybe<Scalars['String']>;
  /** Optional. Use this field when you choose method `CUSTOM_WEBHOOK`. */
  url?: InputMaybe<Scalars['String']>;
};

export type ExportTextProjectDocumentInput = {
  /** Required. The document ID to export. See `getCabinet`. */
  documentId: Scalars['String'];
  /** Optional. Use this field when you choose method `EXTERNAL_FILE_STORAGE`. */
  externalFileStorageParameter?: InputMaybe<ExternalFileStorageInput>;
  /** Required. The filename for the export result. */
  fileName: Scalars['String'];
  /** Optional. The file transformer to be used during the export process. Only applicable when `format` is `CUSTOM`. Defaults to `null`. */
  fileTransformerId?: InputMaybe<Scalars['ID']>;
  /**
   * Required. The exported format depends on the project's task, please refer [here](https://datasaurai.gitbook.io/datasaur/basics/export-project#available-formats).
   * Use `CUSTOM` to export using your team's custom export file transformer, specified in `fileTransformerId`.
   */
  format: Scalars['String'];
  /** Optional. Use this field when you want to export comment and choose the CommentType which you want to export. */
  includedCommentType?: InputMaybe<Array<ExportCommentType>>;
  /** Optional. Use this field when you want to export project with masking format. */
  maskPIIEntities?: InputMaybe<Scalars['Boolean']>;
  /** Required. How the export result is delivered. */
  method: GqlExportMethod;
  /** Optional. Use this field when you choose method `CUSTOM_WEBHOOK`. */
  secret?: InputMaybe<Scalars['String']>;
  /** Optional. Use this field when you choose method `CUSTOM_WEBHOOK`. */
  url?: InputMaybe<Scalars['String']>;
};

export type ExportTextProjectInput = {
  /** Optional. Use this field when you choose method `EXTERNAL_FILE_STORAGE`. */
  externalFileStorageParameter?: InputMaybe<ExternalFileStorageInput>;
  /** Required. The filename for the export result. */
  fileName: Scalars['String'];
  /** Optional. The file transformer to be used during the export process. Only applicable when `format` is `CUSTOM`. Defaults to `null`. */
  fileTransformerId?: InputMaybe<Scalars['ID']>;
  /** Optional. Use this field when you want to export cabinets of specified role */
  filteredCabinetRole?: InputMaybe<Role>;
  /**
   * Required. The exported format depends on the project's task, please refer [here](https://datasaurai.gitbook.io/datasaur/basics/export-project#available-formats).
   * Use `CUSTOM` to export using your team's custom export file transformer, specified in `fileTransformerId`.
   */
  format: Scalars['String'];
  /** Optional. Use this field when you want to export comment and choose the CommentType which you want to export. */
  includedCommentType?: InputMaybe<Array<ExportCommentType>>;
  /** Optional. Use this field when you want to export project with masking format. */
  maskPIIEntities?: InputMaybe<Scalars['Boolean']>;
  /** Required. How the export result is delivered. */
  method: GqlExportMethod;
  /** Required. The project(s) to be exported. See `getProjects`. */
  projectIds: Array<Scalars['ID']>;
  /** Required. Export project based on specified role.  */
  role?: InputMaybe<Role>;
  /** Optional. Use this field when you choose method `CUSTOM_WEBHOOK`. */
  secret?: InputMaybe<Scalars['String']>;
  /** Optional. Use this field when you choose method `CUSTOM_WEBHOOK`. */
  url?: InputMaybe<Scalars['String']>;
};

export type ExportedDocument = {
  __typename?: 'ExportedDocument';
  result: Scalars['String'];
};

export type Extension = {
  __typename?: 'Extension';
  documentType: Scalars['String'];
  elementKind: Scalars['String'];
  elementType: Scalars['String'];
  id: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type ExtensionElement = {
  __typename?: 'ExtensionElement';
  enabled: Scalars['Boolean'];
  extension: Extension;
  height: Scalars['Int'];
  id: Scalars['ID'];
  order: Scalars['Int'];
  setting?: Maybe<ExtensionElementSetting>;
};

export type ExtensionElementSetting = {
  __typename?: 'ExtensionElementSetting';
  apiToken?: Maybe<Scalars['String']>;
  apiURL?: Maybe<Scalars['String']>;
  confidenceScore?: Maybe<Scalars['Float']>;
  extensionId?: Maybe<Scalars['ID']>;
  locked?: Maybe<Scalars['Boolean']>;
  modelId?: Maybe<Scalars['String']>;
  serviceProvider?: Maybe<GqlAutoLabelServiceProvider>;
};

export type ExtensionElementSettingInput = {
  apiToken?: InputMaybe<Scalars['String']>;
  apiURL?: InputMaybe<Scalars['String']>;
  confidenceScore?: InputMaybe<Scalars['Float']>;
  extensionId: Scalars['ID'];
  modelId?: InputMaybe<Scalars['String']>;
  serviceProvider?: InputMaybe<GqlAutoLabelServiceProvider>;
};

export enum ExtensionId {
  AutoLabelRowExtensionId = 'AUTO_LABEL_ROW_EXTENSION_ID',
  AutoLabelTokenExtensionId = 'AUTO_LABEL_TOKEN_EXTENSION_ID',
  BoundingBoxLabelingExtensionId = 'BOUNDING_BOX_LABELING_EXTENSION_ID',
  DashboardExtensionId = 'DASHBOARD_EXTENSION_ID',
  DataProgrammingExtensionId = 'DATA_PROGRAMMING_EXTENSION_ID',
  DictionaryExtensionId = 'DICTIONARY_EXTENSION_ID',
  DocumentLabelingExtensionId = 'DOCUMENT_LABELING_EXTENSION_ID',
  FileCollectionExtensionId = 'FILE_COLLECTION_EXTENSION_ID',
  GrammarCheckerExtensionId = 'GRAMMAR_CHECKER_EXTENSION_ID',
  GuidelinesExtensionId = 'GUIDELINES_EXTENSION_ID',
  LabelsExtensionId = 'LABELS_EXTENSION_ID',
  LabelColorLegendId = 'LABEL_COLOR_LEGEND_ID',
  MetadataExtensionId = 'METADATA_EXTENSION_ID',
  ReviewExtensionId = 'REVIEW_EXTENSION_ID',
  SearchExtensionId = 'SEARCH_EXTENSION_ID',
  TestExtensionId = 'TEST_EXTENSION_ID'
}

export type ExternalFile = {
  __typename?: 'ExternalFile';
  name: Scalars['String'];
  url: Scalars['String'];
};

export type ExternalFileStorageInput = {
  accessKeyId: Scalars['String'];
  bucketName: Scalars['String'];
  objectPath: Scalars['String'];
  secretAccessKey: Scalars['String'];
};

export type ExternalObjectStorage = {
  __typename?: 'ExternalObjectStorage';
  bucketName: Scalars['String'];
  cloudService: ObjectStorageClientName;
  createdAt: Scalars['DateTime'];
  credentials: ExternalObjectStorageCredentials;
  id: Scalars['ID'];
  projects?: Maybe<Array<Maybe<Project>>>;
  team: Team;
  updatedAt: Scalars['DateTime'];
};

export type ExternalObjectStorageCredentials = {
  __typename?: 'ExternalObjectStorageCredentials';
  connectionString?: Maybe<Scalars['String']>;
  externalId?: Maybe<Scalars['String']>;
  roleArn?: Maybe<Scalars['String']>;
  serviceAccount?: Maybe<Scalars['String']>;
};

export type ExternalObjectStorageCredentialsInput = {
  connectionString?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  roleArn?: InputMaybe<Scalars['String']>;
  serviceAccount?: InputMaybe<Scalars['String']>;
};

export type FileTransformer = {
  __typename?: 'FileTransformer';
  content: Scalars['String'];
  createdAt: Scalars['String'];
  externalId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  language: FileTransformerLanguage;
  name: Scalars['String'];
  purpose: FileTransformerPurpose;
  readonly: Scalars['Boolean'];
  transpiled?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  warmup: Scalars['Boolean'];
};

export enum FileTransformerLanguage {
  Typescript = 'TYPESCRIPT'
}

export enum FileTransformerPurpose {
  Export = 'EXPORT',
  Import = 'IMPORT'
}

export type FinalReport = {
  __typename?: 'FinalReport';
  precision: Scalars['Float'];
  recall: Scalars['Float'];
  totalAcceptedLabels: Scalars['Int'];
  totalAppliedLabels: Scalars['Int'];
  totalRejectedLabels: Scalars['Int'];
  totalResolvedLabels: Scalars['Int'];
};

export enum FontSize {
  ExtraLarge = 'EXTRA_LARGE',
  Large = 'LARGE',
  Medium = 'MEDIUM'
}

export enum FontType {
  Monospace = 'MONOSPACE',
  SansSerif = 'SANS_SERIF',
  Serif = 'SERIF'
}

export type GeneralWorkspaceSettings = {
  __typename?: 'GeneralWorkspaceSettings';
  editorFontSize: FontSize;
  editorFontType: FontType;
  editorLineSpacing?: Maybe<GeneralWorkspaceSettingsLineSpacing>;
  id: Scalars['ID'];
  jumpToNextDocumentOnSubmit?: Maybe<Scalars['Boolean']>;
  keepLabelBoxOpenAfterRelabel?: Maybe<Scalars['Boolean']>;
  showIndexBar: Scalars['Boolean'];
  showLabels?: Maybe<GeneralWorkspaceSettingsShowLabels>;
};

export type GeneralWorkspaceSettingsInput = {
  editorFontSize?: InputMaybe<FontSize>;
  editorFontType?: InputMaybe<FontType>;
  editorLineSpacing?: InputMaybe<GeneralWorkspaceSettingsLineSpacing>;
  jumpToNextDocumentOnSubmit?: InputMaybe<Scalars['Boolean']>;
  keepLabelBoxOpenAfterRelabel?: InputMaybe<Scalars['Boolean']>;
  showIndexBar?: InputMaybe<Scalars['Boolean']>;
  showLabels?: InputMaybe<GeneralWorkspaceSettingsShowLabels>;
};

export enum GeneralWorkspaceSettingsLineSpacing {
  Dense = 'DENSE',
  Normal = 'NORMAL',
  Wide = 'WIDE'
}

export enum GeneralWorkspaceSettingsShowLabels {
  Always = 'ALWAYS',
  OnTokenClick = 'ON_TOKEN_CLICK'
}

export type GetBoundingBoxConflictListResult = {
  __typename?: 'GetBoundingBoxConflictListResult';
  items: Array<ConflictBoundingBoxLabel>;
  upToDate: Scalars['Boolean'];
};

export type GetCellPositionsByMetadataFilter = {
  /**
   * Filter Cells by metadata.
   * The filtered Cell must have ALL the specified metadata.
   */
  metadata: Array<CellMetadataInput>;
};

export type GetCellPositionsByMetadataPaginatedInput = {
  /** Filter Cells by the specified parameters. */
  filter?: InputMaybe<GetCellPositionsByMetadataFilter>;
  /**
   * Filter Cells whose `line` is within `start` (inclusive) and `end` (exclusive).
   * Cell's `line` is 0-based indexed.
   */
  page?: InputMaybe<RangePageInput>;
};

export type GetCellPositionsByMetadataPaginatedResponse = PaginatedResponse & {
  __typename?: 'GetCellPositionsByMetadataPaginatedResponse';
  /** List of Cell positions along with the origin document ID. See type `CellPositionWithOriginDocumentId`. */
  nodes: Array<CellPositionWithOriginDocumentId>;
  pageInfo: PageInfo;
  /** Total number of Cells that matches the applied filter. */
  totalCount: Scalars['Int'];
};

export type GetCellsFilterInput = {
  statuses?: InputMaybe<Array<CellStatus>>;
};

export type GetCellsPaginatedInput = {
  cursor?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GetCellsFilterInput>;
  page?: InputMaybe<OffsetPageInput>;
};

export type GetCellsPaginatedResponse = PaginatedResponse & {
  __typename?: 'GetCellsPaginatedResponse';
  nodes: Array<Scalars['CellScalar']>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GetCommentsFilterInput = {
  documentId?: InputMaybe<Scalars['ID']>;
  hashCodes?: InputMaybe<Array<Scalars['String']>>;
  originDocumentId?: InputMaybe<Scalars['ID']>;
  parentId?: InputMaybe<Scalars['ID']>;
  resolved?: InputMaybe<Scalars['Boolean']>;
  userId?: InputMaybe<Scalars['Int']>;
};

export type GetCommentsInput = {
  cursor?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GetCommentsFilterInput>;
  page?: InputMaybe<OffsetPageInput>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type GetCommentsResponse = PaginatedResponse & {
  __typename?: 'GetCommentsResponse';
  nodes: Array<Comment>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GetConflictAnswersInput = {
  documentId: Scalars['ID'];
};

export type GetCurrentUserTeamMemberInput = {
  teamId: Scalars['ID'];
};

export type GetDataProgrammingInput = {
  labels: Array<Scalars['String']>;
  projectId: Scalars['ID'];
};

export type GetDataProgrammingPredictionsInput = {
  dataProgrammingId: Scalars['ID'];
  documents: Array<DocumentForPredictionInput>;
  labelingFunctionIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type GetDatasetFilterInput = {
  kinds?: InputMaybe<Array<DatasetKind>>;
  mlModelSettingId?: InputMaybe<Scalars['String']>;
  teamId: Scalars['ID'];
};

export type GetDatasetsPaginatedInput = {
  cursor?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GetDatasetFilterInput>;
  page?: InputMaybe<OffsetPageInput>;
};

export type GetExportDeliveryStatusResult = {
  __typename?: 'GetExportDeliveryStatusResult';
  deliveryStatus: ExportDeliveryStatus;
  errors: Array<JobError>;
};

export type GetExternalFilesByApiInput = {
  apiUrl: Scalars['String'];
  projectCreationId: Scalars['String'];
  secret: Scalars['String'];
};

export type GetLabelSetTemplatesFilterInput = {
  keyword?: InputMaybe<Scalars['String']>;
  ownerIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  teamId?: InputMaybe<Scalars['ID']>;
  types?: InputMaybe<Array<LabelSetTemplateType>>;
};

export type GetLabelSetTemplatesPaginatedInput = {
  cursor?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GetLabelSetTemplatesFilterInput>;
  page?: InputMaybe<OffsetPageInput>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type GetLabelSetTemplatesResponse = PaginatedResponse & {
  __typename?: 'GetLabelSetTemplatesResponse';
  nodes: Array<LabelSetTemplate>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GetLabelingFunctionsInput = {
  dataProgrammingId: Scalars['ID'];
  labelingFunctionIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type GetLabelsFilterInput = {
  phase?: InputMaybe<ConflictTextLabelResolutionStrategy>;
};

export type GetLabelsPaginatedInput = {
  cursor?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<OffsetPageInput>;
};

export type GetLabelsPaginatedResponse = PaginatedResponse & {
  __typename?: 'GetLabelsPaginatedResponse';
  nodes: Array<Scalars['TextLabelScalar']>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GetMlModelsFilterInput = {
  mlModelSettingId?: InputMaybe<Scalars['ID']>;
  teamId: Scalars['ID'];
  types?: InputMaybe<Array<MlModelKind>>;
};

export type GetMlModelsPaginatedInput = {
  cursor?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GetMlModelsFilterInput>;
  page?: InputMaybe<OffsetPageInput>;
};

export type GetPaginatedQuestionSetFilter = {
  creatorIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  keyword?: InputMaybe<Scalars['String']>;
  teamId?: InputMaybe<Scalars['String']>;
};

export type GetPaginatedQuestionSetInput = {
  cursor?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GetPaginatedQuestionSetFilter>;
  page?: InputMaybe<OffsetPageInput>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type GetPaginatedQuestionSetResponse = PaginatedResponse & {
  __typename?: 'GetPaginatedQuestionSetResponse';
  nodes: Array<QuestionSet>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GetPersonalTagsInput = {
  filter?: InputMaybe<GetTagsFilterInput>;
};

export type GetPredictedLabelsInput = {
  documentId: Scalars['ID'];
};

export type GetProjectConflictListResult = {
  __typename?: 'GetProjectConflictListResult';
  items: Array<ProjectConflictListItem>;
  upToDate: Scalars['Boolean'];
};

export type GetProjectInput = {
  projectId: Scalars['ID'];
  teamId?: InputMaybe<Scalars['ID']>;
};

/** Parameters to filter the projects */
export type GetProjectsFilterInput = {
  /** Optional. Filters projects by its creation date. */
  daysCreatedRange?: InputMaybe<DaysCreatedInput>;
  /** Optional. Filters projects by archived state. */
  isArchived?: InputMaybe<Scalars['Boolean']>;
  /** Optional. Filters projects by keyword, searches project name and tags. By default shows all projects. */
  keyword?: InputMaybe<Scalars['String']>;
  /** Optional. Filters projects by its kind. */
  kinds?: InputMaybe<Array<ProjectKind>>;
  /** Optional. Filters projects by its LabelSet. See `LabelSet.signature`. */
  labelSetSignatures?: InputMaybe<Array<Scalars['String']>>;
  /** Optional. Filters projects by its labeler. */
  labelerTeamMemberIds?: InputMaybe<Array<Scalars['ID']>>;
  /** Optional. Filters projects by its reviewer. */
  reviewerTeamMemberIds?: InputMaybe<Array<Scalars['ID']>>;
  /** Optional. Filters projects by its status. */
  statuses?: InputMaybe<Array<GqlProjectAndLabelingStatus>>;
  /** Optional. Filters projects by its tag IDs. To filter by tag names, use the `keyword` field. To see a list of tag IDs, see query `getTags` and `getPersonalTags` */
  tags?: InputMaybe<Array<Scalars['String']>>;
  /** Optional. Filters projects by teams. Defaults to `null`, shows all projects under the personal workspace. */
  teamId?: InputMaybe<Scalars['ID']>;
  /** Deprecated. To filter by types (POS, NER, etc), use the `tags` or `keyword` option instead. */
  types?: InputMaybe<Array<TextDocumentType>>;
};

/** Parameters for getProjects endpoint. */
export type GetProjectsPaginatedInput = {
  /** Cursor to the current page of result. */
  cursor?: InputMaybe<Scalars['String']>;
  /** Filters the projects by the specified parameters. */
  filter?: InputMaybe<GetProjectsFilterInput>;
  /**
   * Offset Pagination controls.
   * `skip`: The number of projects to be skipped.
   * `take`: The maximum number of projects to be returned.
   */
  page?: InputMaybe<OffsetPageInput>;
  /**
   * Sorts the projects by a specified field.
   * `field`: The field to sort.
   * `order`: one of [ASC, DESC].
   */
  sort?: InputMaybe<Array<SortInput>>;
};

export type GetRowAnswerConflictsInput = {
  documentId: Scalars['ID'];
  end: Scalars['Int'];
  start: Scalars['Int'];
};

export type GetRowAnswersPaginatedInput = {
  cursor?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<RangePageInput>;
};

export type GetRowAnswersPaginatedResponse = PaginatedResponse & {
  __typename?: 'GetRowAnswersPaginatedResponse';
  nodes: Array<RowAnswer>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GetSpanAndArrowConflictsPaginatedInput = {
  cursor?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<OffsetPageInput>;
};

export type GetSpanAndArrowConflictsPaginatedResponse = PaginatedResponse & {
  __typename?: 'GetSpanAndArrowConflictsPaginatedResponse';
  nodes: Array<Scalars['ConflictTextLabelScalar']>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GetSpanAndArrowRejectedLabelsPaginatedInput = {
  cursor?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<OffsetPageInput>;
};

export type GetSpanAndArrowRejectedLabelsPaginatedResponse = PaginatedResponse & {
  __typename?: 'GetSpanAndArrowRejectedLabelsPaginatedResponse';
  nodes: Array<Scalars['ConflictTextLabelScalar']>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GetTagsFilterInput = {
  includeGlobalTag: Scalars['Boolean'];
};

export type GetTagsInput = {
  filter?: InputMaybe<GetTagsFilterInput>;
  teamId?: InputMaybe<Scalars['ID']>;
};

export type GetTeamDetailInput = {
  id: Scalars['ID'];
};

export type GetTeamMemberAssignedProjectsInput = {
  teamId: Scalars['ID'];
};

export type GetTeamMembersFilterInput = {
  keyword?: InputMaybe<Scalars['String']>;
  roleId?: InputMaybe<Array<Scalars['ID']>>;
  teamId: Scalars['ID'];
};

export type GetTeamMembersPaginatedInput = {
  cursor?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GetTeamMembersFilterInput>;
  page?: InputMaybe<OffsetPageInput>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type GetTeamMembersPaginatedResponse = PaginatedResponse & {
  __typename?: 'GetTeamMembersPaginatedResponse';
  nodes: Array<TeamMember>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GetTeamProjectAssigneesInput = {
  projectId: Scalars['ID'];
};

export type GetTeamTimelineEventsFilter = {
  endDate?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['ID']>;
  startDate?: InputMaybe<Scalars['String']>;
  teamId: Scalars['String'];
  userId?: InputMaybe<Scalars['ID']>;
};

export type GetTeamTimelineEventsInput = {
  cursor?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GetTeamTimelineEventsFilter>;
  page?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type GetTeamTimelineEventsResponse = PaginatedResponse & {
  __typename?: 'GetTeamTimelineEventsResponse';
  nodes: Array<TimelineEvent>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GetUsageInput = {
  end: Scalars['String'];
  start: Scalars['String'];
};

export enum GqlAutoLabelModelPrivacy {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export enum GqlAutoLabelServiceProvider {
  AssistedLabeling = 'ASSISTED_LABELING',
  CorenlpNer = 'CORENLP_NER',
  CorenlpPos = 'CORENLP_POS',
  Custom = 'CUSTOM',
  DistilbertOpiec = 'DISTILBERT_OPIEC',
  Huggingface = 'HUGGINGFACE',
  Nltk = 'NLTK',
  SentimentAnalysis = 'SENTIMENT_ANALYSIS',
  Spacy = 'SPACY',
  SparknlpNer = 'SPARKNLP_NER',
  SparknlpPos = 'SPARKNLP_POS'
}

export type GqlConflictable = {
  __typename?: 'GqlConflictable';
  acceptedByUserId?: Maybe<Scalars['Int']>;
  documentId: Scalars['String'];
  hashCode: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  labeledBy: ConflictTextLabelResolutionStrategy;
  labeledByUserId?: Maybe<Scalars['Int']>;
  rejectedByUserId?: Maybe<Scalars['Int']>;
  type: LabelEntityType;
};

export type GqlConflictableInput = {
  acceptedByUserId?: InputMaybe<Scalars['Int']>;
  documentId: Scalars['String'];
  hashCode: Scalars['String'];
  id?: InputMaybe<Scalars['String']>;
  labeledBy: ConflictTextLabelResolutionStrategy;
  labeledByUserId?: InputMaybe<Scalars['Int']>;
  rejectedByUserId?: InputMaybe<Scalars['Int']>;
  type: LabelEntityType;
};

export enum GqlExportMethod {
  /** Sends the download link to custom webhook. */
  CustomWebhook = 'CUSTOM_WEBHOOK',
  /** Deprecated. Please use the other options. */
  Download = 'DOWNLOAD',
  /** Returns a redirect link. */
  DownloadRequest = 'DOWNLOAD_REQUEST',
  /** Sends the download link to creator email. */
  Email = 'EMAIL',
  ExternalFileStorage = 'EXTERNAL_FILE_STORAGE',
  /** Returns file url. */
  FileStorage = 'FILE_STORAGE'
}

export enum GqlLabelingStatus {
  Complete = 'COMPLETE',
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED'
}

export enum GqlProjectAndLabelingStatus {
  Complete = 'COMPLETE',
  Created = 'CREATED',
  InProgress = 'IN_PROGRESS',
  InReview = 'IN_REVIEW',
  NotStarted = 'NOT_STARTED',
  ReviewReady = 'REVIEW_READY'
}

export enum GqlProjectStatus {
  Complete = 'COMPLETE',
  Created = 'CREATED',
  InProgress = 'IN_PROGRESS',
  InReview = 'IN_REVIEW',
  ReviewReady = 'REVIEW_READY'
}

export type GrammarCheckerInput = {
  documentId: Scalars['ID'];
  grammarCheckerProviderId: Scalars['ID'];
  sentenceIdRange?: InputMaybe<RangeInput>;
  sentenceIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type GrammarCheckerServiceProvider = {
  __typename?: 'GrammarCheckerServiceProvider';
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type GrammarMistake = {
  __typename?: 'GrammarMistake';
  message: Scalars['String'];
  position: TextRange;
  suggestions: Array<Scalars['String']>;
  text: Scalars['String'];
};

export type Guideline = {
  __typename?: 'Guideline';
  content: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  project?: Maybe<Project>;
};

export type HeaderColumnInput = {
  displayed: Scalars['Boolean'];
  labelerRestricted: Scalars['Boolean'];
  name: Scalars['String'];
};

export type ImportTextDocumentInput = {
  textDocumentFile: Scalars['Upload'];
  textDocumentId: Scalars['ID'];
};

export type ImportedBoundingBoxLabel = {
  __typename?: 'ImportedBoundingBoxLabel';
  end: TextCursor;
  id: Scalars['Int'];
  labelSetIndex: Scalars['Int'];
  nodeCount: Scalars['Int'];
  start: TextCursor;
  type: LabelEntityType;
  x0?: Maybe<Scalars['Int']>;
  x1?: Maybe<Scalars['Int']>;
  x2?: Maybe<Scalars['Int']>;
  x3?: Maybe<Scalars['Int']>;
  y0?: Maybe<Scalars['Int']>;
  y1?: Maybe<Scalars['Int']>;
  y2?: Maybe<Scalars['Int']>;
  y3?: Maybe<Scalars['Int']>;
};

export type ImportedCell = {
  __typename?: 'ImportedCell';
  content: Scalars['String'];
  index: Scalars['Int'];
  line: Scalars['Int'];
  metadata?: Maybe<Array<CellMetadata>>;
  tokens: Array<Scalars['String']>;
};

export type ImportedDocument = {
  __typename?: 'ImportedDocument';
  boundingBoxLabels: Array<ImportedBoundingBoxLabel>;
  cells: Array<ImportedCell>;
  spanAndArrowLabels: Array<ImportedSpanAndArrowLabel>;
  timestampLabels: Array<ImportedTimestampLabel>;
};

export type ImportedLabelItem = {
  __typename?: 'ImportedLabelItem';
  id: Scalars['String'];
  labelName: Scalars['String'];
};

export type ImportedLabelSet = {
  __typename?: 'ImportedLabelSet';
  index: Scalars['Int'];
  labelItems: Array<ImportedLabelItem>;
  name?: Maybe<Scalars['String']>;
};

export type ImportedSpanAndArrowLabel = {
  __typename?: 'ImportedSpanAndArrowLabel';
  destinationId?: Maybe<Scalars['Int']>;
  end: TextCursor;
  id: Scalars['Int'];
  labelName: Scalars['String'];
  labelSetIndex: Scalars['Int'];
  originId?: Maybe<Scalars['Int']>;
  start: TextCursor;
  type: LabelEntityType;
};

export type ImportedTimestampLabel = {
  __typename?: 'ImportedTimestampLabel';
  end: TextCursor;
  endTimestampMillis: Scalars['Int'];
  id: Scalars['Int'];
  labelSetIndex: Scalars['Int'];
  /** Whether the label position should span over the cell it is bound to. */
  shouldExpand?: Maybe<Scalars['Boolean']>;
  start: TextCursor;
  startTimestampMillis: Scalars['Int'];
  type: LabelEntityType;
};

export type InsertTargetInput = {
  afterId?: InputMaybe<Scalars['Int']>;
  beforeId?: InputMaybe<Scalars['Int']>;
};

export type InvalidAnswerInfo = {
  __typename?: 'InvalidAnswerInfo';
  documentId: Scalars['ID'];
  fileName: Scalars['String'];
  lines?: Maybe<Array<Scalars['Int']>>;
};

export type InvitationVerificationResult = {
  __typename?: 'InvitationVerificationResult';
  email?: Maybe<Scalars['String']>;
  isValid: Scalars['Boolean'];
  teamId: Scalars['ID'];
  userIsRegistered: Scalars['Boolean'];
};

export type InviteTeamMembersInput = {
  members: Array<TeamMemberInput>;
  teamId: Scalars['ID'];
};

export type Job = {
  __typename?: 'Job';
  additionalData?: Maybe<JobAdditionalData>;
  createdAt: Scalars['String'];
  errors: Array<JobError>;
  id: Scalars['String'];
  progress: Scalars['Int'];
  result?: Maybe<Scalars['JobResult']>;
  resultId?: Maybe<Scalars['String']>;
  status: JobStatus;
  updatedAt: Scalars['String'];
};

export type JobAdditionalData = {
  __typename?: 'JobAdditionalData';
  automationActivityId?: Maybe<Scalars['ID']>;
};

export type JobError = {
  __typename?: 'JobError';
  args?: Maybe<Scalars['JobErrorArgs']>;
  id: Scalars['String'];
  stack: Scalars['String'];
};

export enum JobStatus {
  Delivered = 'DELIVERED',
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  None = 'NONE',
  Queued = 'QUEUED'
}

export enum KeyPayloadType {
  Project = 'PROJECT',
  User = 'USER'
}

export type LabelClassArrowRule = {
  __typename?: 'LabelClassArrowRule';
  destinationIds: Array<Scalars['ID']>;
  originIds: Array<Scalars['ID']>;
};

export type LabelClassArrowRuleInput = {
  destinationIds: Array<Scalars['ID']>;
  originIds: Array<Scalars['ID']>;
};

export enum LabelClassType {
  All = 'ALL',
  Arrow = 'ARROW',
  Span = 'SPAN'
}

export enum LabelEntityType {
  Arrow = 'ARROW',
  BboxBound = 'BBOX_BOUND',
  BoundingBox = 'BOUNDING_BOX',
  QuestionBound = 'QUESTION_BOUND',
  Span = 'SPAN',
  Timestamp = 'TIMESTAMP'
}

export type LabelObject = {
  __typename?: 'LabelObject';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type LabelObjectInput = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export enum LabelPhase {
  Auto = 'AUTO',
  Conflict = 'CONFLICT',
  External = 'EXTERNAL',
  Labeler = 'LABELER',
  Prelabeled = 'PRELABELED',
  Reviewer = 'REVIEWER'
}

export type LabelSet = {
  __typename?: 'LabelSet';
  arrowLabelRequired: Scalars['Boolean'];
  /** Unique identifier of the labelset. */
  id: Scalars['ID'];
  /**
   * The labelset's zero-based index in a project.
   * Each project can have up to 5 labelset.
   */
  index: Scalars['Int'];
  lastUsedBy?: Maybe<LastUsedProject>;
  name: Scalars['String'];
  /** A labelset signature. The signature is generated based on the labelset's items. */
  signature?: Maybe<Scalars['String']>;
  tagItems: Array<TagItem>;
};

export type LabelSetConfigInput = {
  activationConditionLogic?: InputMaybe<Scalars['String']>;
  /** Applies for `DATE`, `TIME`. Possible value `NOW` */
  defaultValue?: InputMaybe<Scalars['String']>;
  /** Applies for `DATE`, `TIME`. Possible values for `DATE` are `DD-MM-YYYY`, `MM-DD-YYYY`, `YYYY-MM-DD` `DD/MM/YYYY`, `MM/DD/YYYY` and `YYYY/MM/DD`. Possible values for `TIME` are `HH:mm:ss`, `HH:mm`, `HH.mm.ss`, and `HH.mm` */
  format?: InputMaybe<Scalars['String']>;
  /** Applies for `CHECKBOX`. */
  hint?: InputMaybe<Scalars['String']>;
  /** Applies for `SLIDER`. */
  max?: InputMaybe<Scalars['Int']>;
  /** Applies for `TEXT`. */
  maxLength?: InputMaybe<Scalars['Int']>;
  /** Applies for `SLIDER`. */
  min?: InputMaybe<Scalars['Int']>;
  /** Applies for `TEXT`. */
  minLength?: InputMaybe<Scalars['Int']>;
  /** Applies for `TEXT`. Set it as true if you want to enter long text. */
  multiline?: InputMaybe<Scalars['Boolean']>;
  /** Applies for `TEXT`, `NESTED`, `DROPDOWN`, `HIERARCHICAL_DROPDOWN`. Set it as true if you want to have multiple answers for this question. */
  multiple?: InputMaybe<Scalars['Boolean']>;
  /**
   * Applies for `DROPDOWN`, `HIERARCHICAL_DROPDOWN` and `TOKEN`.
   * - `TOKEN`: List of labelset items in the labelset. Each item needs at least an ID and a label.
   */
  options?: InputMaybe<Array<LabelSetConfigOptionsInput>>;
  /** Applies for `TEXT`. This field can contain a regex string, which the browser natively uses for validation. E.g. `[0-9]*` */
  pattern?: InputMaybe<Scalars['String']>;
  /** Applies for `NESTED`. */
  questions?: InputMaybe<Array<LabelSetTemplateItemInput>>;
  /** Applies for `SLIDER`. */
  step?: InputMaybe<Scalars['Int']>;
  /** Applies for `SLIDER`. */
  theme?: InputMaybe<SliderTheme>;
};

/** Represents a labelset item. */
export type LabelSetConfigOptions = {
  __typename?: 'LabelSetConfigOptions';
  /** Only has effect if type is ARROW. */
  arrowRules?: Maybe<Array<LabelClassArrowRule>>;
  /** The labelset item color when shown in web UI. 6 digit hex string, prefixed by #. Example: #df3920. */
  color?: Maybe<Scalars['String']>;
  /** Unique identifier of the labelset item. */
  id: Scalars['ID'];
  /** The labelset item name shown in web UI. */
  label: Scalars['String'];
  /** Optional. Use this field if you want to create hierarchical options. Use another option's id to make it as a parent option. */
  parentId?: Maybe<Scalars['ID']>;
  /** Can be SPAN, ARROW, or ALL. Defaults to ALL. */
  type: LabelClassType;
};

export type LabelSetConfigOptionsInput = {
  /** Optional. Only has effect if type is ARROW. */
  arrowRules?: InputMaybe<Array<LabelClassArrowRuleInput>>;
  /** Optional. Sets the labelset item color when shown in web UI. Accepts a 6 digit hex string, prefixed by #. Example: #df3920. */
  color?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  /** Required. Unique identifier of the labelset item. */
  id: Scalars['ID'];
  /** Required. The labelset item name shown in web UI. */
  label: Scalars['String'];
  /** Optional. Use this field if you want to create hierarchical options. Use another option's id to make it as a parent option. */
  parentId?: InputMaybe<Scalars['ID']>;
  /** Optional. Can be SPAN, ARROW, or ALL. Defaults to ALL. */
  type?: InputMaybe<LabelClassType>;
};

export type LabelSetTemplate = {
  __typename?: 'LabelSetTemplate';
  count: Scalars['Int'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  items?: Maybe<Array<LabelSetTemplateItem>>;
  name: Scalars['String'];
  owner?: Maybe<User>;
  type: LabelSetTemplateType;
  updatedAt: Scalars['String'];
};

export type LabelSetTemplateItem = {
  __typename?: 'LabelSetTemplateItem';
  activationConditionLogic?: Maybe<Scalars['String']>;
  arrowLabelRequired: Scalars['Boolean'];
  bindToColumn?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  defaultValue?: Maybe<Scalars['String']>;
  description: Scalars['String'];
  format?: Maybe<Scalars['String']>;
  hint?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  index?: Maybe<Scalars['String']>;
  labelSetTemplateId: Scalars['String'];
  max?: Maybe<Scalars['Int']>;
  maxLength?: Maybe<Scalars['Int']>;
  min?: Maybe<Scalars['Int']>;
  minLength?: Maybe<Scalars['Int']>;
  multiline?: Maybe<Scalars['Boolean']>;
  multipleChoice?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  /**
   * For type:
   * - `TOKEN`: List of labelset items in the labelset
   */
  options?: Maybe<Array<LabelSetConfigOptions>>;
  parentIndex?: Maybe<Scalars['String']>;
  pattern?: Maybe<Scalars['String']>;
  required?: Maybe<Scalars['Boolean']>;
  step?: Maybe<Scalars['Int']>;
  theme?: Maybe<SliderTheme>;
  type: LabelSetTemplateItemType;
  updatedAt?: Maybe<Scalars['String']>;
};

export type LabelSetTemplateItemInput = {
  /** Optional. Binds to the specified column */
  bindToColumn?: InputMaybe<Scalars['String']>;
  /** Required. Configures the labelset items. */
  config?: InputMaybe<LabelSetConfigInput>;
  /** Message shown to Labeler. */
  label?: InputMaybe<Scalars['String']>;
  /** Optional. Column name. */
  name?: InputMaybe<Scalars['String']>;
  /** This marks whether the question is required to answer or not. */
  required?: InputMaybe<Scalars['Boolean']>;
  /** Optional. Type of the question */
  type?: InputMaybe<LabelSetTemplateItemType>;
};

export enum LabelSetTemplateItemType {
  /** This type provides a checkbox. */
  Checkbox = 'CHECKBOX',
  /** This type provides a date picker. */
  Date = 'DATE',
  /** This type provides a dropdown with multiple options. */
  Dropdown = 'DROPDOWN',
  /** This type provides a dropdown with hierarchical options. */
  HierarchicalDropdown = 'HIERARCHICAL_DROPDOWN',
  /** You can create nested questions. Questions inside a question by using this type. */
  Nested = 'NESTED',
  /** This type provides a slider with customizeable minimum value and maximum value. */
  Slider = 'SLIDER',
  /** This type provides a text area. */
  Text = 'TEXT',
  /** This type provides a time picker. */
  Time = 'TIME',
  /** This type provides a token field. */
  Token = 'TOKEN',
  /** This type provides a URL field. */
  Url = 'URL'
}

export enum LabelSetTemplateType {
  Question = 'QUESTION',
  Token = 'TOKEN'
}

export type LabelSetTextProjectInput = {
  arrowLabelRequired?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  options: Array<LabelSetTextProjectOptionInput>;
};

export type LabelSetTextProjectOptionInput = {
  arrowRules?: InputMaybe<Array<LabelClassArrowRuleInput>>;
  color?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  label: Scalars['String'];
  parentId?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<LabelClassType>;
};

export type LabelerStatistic = {
  __typename?: 'LabelerStatistic';
  numberOfAcceptedLabels: Scalars['Int'];
  numberOfRejectedLabels: Scalars['Int'];
  userId: Scalars['ID'];
};

export type LabelingFunction = {
  __typename?: 'LabelingFunction';
  active: Scalars['Boolean'];
  content: Scalars['String'];
  createdAt: Scalars['String'];
  dataProgrammingId: Scalars['ID'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type LabelingStatus = {
  __typename?: 'LabelingStatus';
  isCompleted: Scalars['Boolean'];
  isStarted: Scalars['Boolean'];
  labeler: TeamMember;
  statistic: LabelingStatusStatistic;
  statisticsToShow: Array<StatisticItem>;
};

export type LabelingStatusStatistic = {
  __typename?: 'LabelingStatusStatistic';
  documentIds: Array<Scalars['ID']>;
  id: Scalars['ID'];
  numberOfAcceptedLabels: Scalars['Int'];
  numberOfDocuments: Scalars['Int'];
  numberOfRejectedLabels: Scalars['Int'];
  numberOfSentences: Scalars['Int'];
  numberOfTouchedDocuments: Scalars['Int'];
  numberOfTouchedSentences: Scalars['Int'];
  numberOfUnresolvedLabels: Scalars['Int'];
  totalLabelsApplied: Scalars['Int'];
  totalTimeSpent: Scalars['Int'];
};

export type LabelingTracker = {
  __typename?: 'LabelingTracker';
  lastLabeledLine?: Maybe<Scalars['Int']>;
  textDocumentId: Scalars['ID'];
};

export type LastUsedProject = {
  __typename?: 'LastUsedProject';
  name: Scalars['String'];
  projectId: Scalars['ID'];
};

/** Configuration parameter for project creation. */
export type LaunchTextProjectInput = {
  /** Deprecated. Please use field `documentAssignments` instead. */
  assignees?: InputMaybe<Array<ProjectAssignmentByNameInput>>;
  /** Optional. Label sets for bounding box labeling. No need to create them separately, just pass these data when launching the project. */
  bboxLabelSets?: InputMaybe<Array<BBoxLabelSetProjectInput>>;
  /** Optional. Team projects only. Assign specific document to specific team member. */
  documentAssignments?: InputMaybe<Array<DocumentAssignmentInput>>;
  /** Document related configuration, such as token length and custom script. */
  documentSettings: TextDocumentSettingsInput;
  /** Required. The documents associated to the project. Please ensure all the documents uploaded are of the same type. */
  documents?: InputMaybe<Array<CreateTextDocumentInput>>;
  /** Optional. Set the external object storage to use. Null means default object storage */
  externalObjectStorageId?: InputMaybe<Scalars['ID']>;
  /** Optional. Sets the labeling guideline for the project. */
  guidelineId?: InputMaybe<Scalars['ID']>;
  /** Required. Sets the project kinds. */
  kinds?: InputMaybe<Array<ProjectKind>>;
  /** Optional. LabelSetId for Token Based Labeling. You can provide labelSetId when creating project or you can create LabelSet after the project is created. */
  labelSetIDs?: InputMaybe<Array<Scalars['ID']>>;
  /** Deprecated. Please use field `labelSets` instead. */
  labelSetId?: InputMaybe<Scalars['ID']>;
  /** Optional. LabelSets for token based labeling. No need to create them separately, just pass these data when launching the project. */
  labelSets?: InputMaybe<Array<LabelSetTextProjectInput>>;
  /** Optional. Sets the default Datasaur extensions for labelers. */
  labelerExtensions?: InputMaybe<Array<ExtensionId>>;
  /** Required. Sets the project name. */
  name: Scalars['String'];
  /** Used as unique identifier for the project creation. */
  projectCreationId?: InputMaybe<Scalars['String']>;
  /** Sets the new project settings */
  projectSettings?: InputMaybe<ProjectSettingsInput>;
  /** Optional. Defaults to `LABELING` */
  purpose?: InputMaybe<ProjectPurpose>;
  /** Optional. Sets the default Datasaur extensions for reviewers. */
  reviewerExtensions?: InputMaybe<Array<ExtensionId>>;
  /** Optional. Sets the document splitting behavior. Assign `null` to skip document splitting */
  splitDocumentOption?: InputMaybe<SplitDocumentOptionInput>;
  /** The tag names associated with the project */
  tagNames?: InputMaybe<Array<Scalars['String']>>;
  /** Optional. Defaults to `null`, which creates a personal project. */
  teamId?: InputMaybe<Scalars['ID']>;
  /** Use DOC when you want to create Doc Based Labeling or [any project template](https://datasaurai.gitbook.io/datasaur/basics/creating-a-project/project-templates) */
  type?: InputMaybe<TextDocumentType>;
};

export type Legend = {
  __typename?: 'Legend';
  alignment: LegendAlignment;
  position: LegendPosition;
};

export enum LegendAlignment {
  Center = 'CENTER',
  End = 'END',
  Start = 'START'
}

export enum LegendPosition {
  Bottom = 'BOTTOM',
  In = 'IN',
  Left = 'LEFT',
  None = 'NONE',
  Right = 'RIGHT',
  Top = 'TOP'
}

export type LoginInput = {
  betaKey?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  invitationKey?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  recaptcha?: InputMaybe<Scalars['String']>;
  redirect?: InputMaybe<Scalars['String']>;
};

export type LoginSuccess = {
  __typename?: 'LoginSuccess';
  redirect?: Maybe<Scalars['String']>;
  user: User;
};

export enum MlModelKind {
  DocumentBased = 'DOCUMENT_BASED',
  RowBased = 'ROW_BASED',
  TokenBased = 'TOKEN_BASED'
}

/** Determines how media displayed in editor. */
export enum MediaDisplayStrategy {
  /** Media will be rendered with its original size. */
  Full = 'FULL',
  /** Media will be not rendered. */
  None = 'NONE',
  /** Media will be rendered as thumbnail. */
  Thumbnail = 'THUMBNAIL'
}

export type MlModel = {
  __typename?: 'MlModel';
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  kind: MlModelKind;
  mlModelSettingId: Scalars['ID'];
  teamId: Scalars['ID'];
  updatedAt?: Maybe<Scalars['String']>;
  version: Scalars['Int'];
};

export type MlModelInput = {
  kind: MlModelKind;
  meta?: InputMaybe<Scalars['String']>;
  mlModelSettingId: Scalars['ID'];
  teamId: Scalars['ID'];
  version: Scalars['Int'];
};

export type MlModelPaginatedResponse = PaginatedResponse & {
  __typename?: 'MlModelPaginatedResponse';
  nodes: Array<MlModel>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type MlModelSetting = {
  __typename?: 'MlModelSetting';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  labelSetSignatures: Array<Scalars['String']>;
  labels: Array<Scalars['String']>;
  teamId: Scalars['ID'];
  updatedAt: Scalars['String'];
};

export type MlModelSettingInput = {
  id?: InputMaybe<Scalars['ID']>;
  labelSetSignatures: Array<Scalars['String']>;
  labels: Array<Scalars['String']>;
  teamId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptBoundingBoxConflict: Array<BoundingBoxLabel>;
  acceptInvitation: Team;
  acceptTimestampLabelConflicts: Array<TimestampLabel>;
  activateUser?: Maybe<LoginSuccess>;
  addActiveDuration?: Maybe<Scalars['Boolean']>;
  addFileToDataset: Scalars['Boolean'];
  addLabelingFunction: LabelingFunction;
  addTextDocumentLabels: TextDocument;
  allowIPs: Array<Scalars['String']>;
  /** Adds new labelset item to the specified labelset. */
  appendLabelSetTagItems?: Maybe<Array<TagItem>>;
  autoLabelReviewTextDocumentBasedOnConsensus: TextDocument;
  autoLabelTokenBasedProject: Job;
  awsMarketplaceReportMeteredRecords: Scalars['Boolean'];
  awsMarketplaceSubscription: Scalars['Boolean'];
  bulkSetPasswordsExpiredAt: Scalars['Boolean'];
  calculateAgreementTables: Job;
  calculatePairKappas: Array<Scalars['String']>;
  clearAllLabelsOnTextDocument: ClearAllLabelsOnTextDocumentResult;
  clearAllSpanAndArrowLabels: ClearAllLabelsOnTextDocumentResult;
  collectDataset?: Maybe<Job>;
  createComment: Comment;
  createCustomAPI: CustomApi;
  createExternalObjectStorage: ExternalObjectStorage;
  createFileTransformer: FileTransformer;
  createGuideline: Guideline;
  /**
   * Creates a new labelset.
   * The created labelset will appear in `getCabinetLabelSetsById`
   */
  createLabelSet: LabelSet;
  /** Creates a new labelset template. */
  createLabelSetTemplate?: Maybe<LabelSetTemplate>;
  createPersonalTag: Tag;
  createProjectTemplate: ProjectTemplate;
  createQuestionSet: QuestionSet;
  createQuestionSetTemplate: QuestionSetTemplate;
  createTag: Tag;
  createTagsIfNotExist: Array<Tag>;
  createTeam: Team;
  deleteBBoxLabels: Array<BBoxLabel>;
  deleteBoundingBox: Array<BoundingBoxLabel>;
  deleteComment: Scalars['Boolean'];
  deleteCustomAPI: CustomApi;
  deleteDataset: Scalars['Boolean'];
  deleteDocumentAnswers: Scalars['Boolean'];
  deleteDocumentBoundLabels: Scalars['Boolean'];
  deleteExtensionElement?: Maybe<ProjectExtension>;
  deleteExternalObjectStorage: ExternalObjectStorage;
  deleteGuideline: Scalars['Boolean'];
  /**
   * Deletes a labelset.
   * If the labelset is used in a project, any labelset item from the labelset that has been applied will be removed.
   */
  deleteLabelSet: Array<Scalars['ID']>;
  /** Deletes the specified labelset templates. Returns true if the templates are deleted successfully. */
  deleteLabelSetTemplates?: Maybe<Scalars['Boolean']>;
  deleteLabelingFunctions: Scalars['Boolean'];
  deleteLabelsOnTextDocument: DeleteLabelsOnTextDocumentResult;
  deleteMlModel: Scalars['Boolean'];
  deleteProject: Project;
  deleteProjectTemplates?: Maybe<Scalars['Boolean']>;
  deleteProjects: Array<Project>;
  deleteQuestionSet: Scalars['Boolean'];
  deleteQuestionSets: Scalars['Boolean'];
  deleteRowAnswers: Scalars['Boolean'];
  deleteSentence: DeleteSentenceResult;
  deleteTextDocument?: Maybe<DeleteTextDocumentResult>;
  deleteTimestampLabels: Array<TimestampLabel>;
  editSentence: EditSentenceResult;
  enableProjectExtensionElements?: Maybe<ProjectExtension>;
  importTextDocument: TextDocument;
  insertSentence: Cell;
  inviteTeamMembers: Array<TeamMember>;
  /**
   * Deprecated. Please use `launchTextProjectAsync`.
   * @deprecated Please use `launchTextProjectAsync`.
   */
  launchTextProject: Project;
  /**
   * Creates a new project based on the specified configuration.
   *   For sample clients, see [here](https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/script-usage-for-project-creation-via-api).
   *   Always returns a `ProjectLaunchJob` with a `Job.id` to check the status of the launch. See `getJob`.
   *
   *   Minimal example `curl` call for creating a token-based project (this will result in a lot of default settings, use with caution):
   *   ```bash
   *   curl --location --request POST 'https://BASE_URL/graphql?operation=LaunchTextProjectAsyncMutation' \
   *   --header 'Authorization: Bearer ACCESS_TOKEN' \
   *   --form 'operations="{
   *     \"operationName\": \"LaunchTextProjectAsyncMutation\",
   *     \"variables\": {
   *       \"input\": {
   *         \"documentSettings\": {
   *           \"kind\": \"TOKEN_BASED\"
   *         },
   *         \"name\": \"project-name\",
   *         \"projectCreationId\": \"unique-project-creation-id\",
   *         \"purpose\": \"LABELING\",
   *         \"documentAssignments\": [
   *           {
   *             \"teamMemberId\": \"1\",
   *             \"documents\": [{ \"fileName\": \"filename.txt\", \"part\": 0 }],
   *             \"role\": \"LABELER_AND_REVIEWER\"
   *           }
   *         ],
   *         \"splitDocumentOption\": null,
   *         \"projectSettings\": {},
   *         \"teamId\": \"1\",
   *         \"documents\": [
   *           {
   *             \"file\": null,
   *             \"fileName\": \"filename.txt\",
   *             \"name\": \"project-name\",
   *             \"settings\": {},
   *             \"docFileOptions\": {
   *               \"firstRowAsHeader\": false
   *             }
   *           }
   *         ],
   *         \"labelSetIDs\": [\"1\"]
   *       }
   *     },
   *     \"query\": \"mutation LaunchTextProjectAsyncMutation($input: LaunchTextProjectInput!) { launchTextProjectAsync(input: $input) {   job {     ...JobFragment     __typename   }   name   __typename }} fragment JobFragment on Job { id status progress errors {   id   stack   args   __typename } resultId __typename}\"
   *   }"' \
   *   --form 'map="{\"1\":[\"variables.input.documents.0.file\"]}"' \
   *   --form '1=@"filename.txt"'
   *   ```
   */
  launchTextProjectAsync: ProjectLaunchJob;
  login?: Maybe<LoginSuccess>;
  logout?: Maybe<Scalars['String']>;
  overrideSentences: UpdateSentenceResult;
  /** Redact Cells' content and tokens. The content and tokens will be replaced by asterisks (*). */
  redactCells: Scalars['Boolean'];
  /**
   * Redact data related to Text Document:
   * * Cells
   * * File that is stored in Datasaur's file storage
   */
  redactTextDocuments: Scalars['Boolean'];
  rejectBoundingBoxConflict: Array<BoundingBoxLabel>;
  rejectTimestampLabelConflicts: Array<TimestampLabel>;
  removeFileTransformer: FileTransformer;
  removePersonalTags: Array<RemoveTagsResult>;
  removeQuestionSetTemplate: Scalars['Boolean'];
  removeSearchKeyword: SearchHistoryKeyword;
  removeTags: Array<RemoveTagsResult>;
  removeTeamMember?: Maybe<TeamMember>;
  removeTextDocumentLabels: TextDocument;
  replaceProjectAssignees: Project;
  replyComment: Comment;
  requestDemo: RequestDemo;
  requestResetPasswordByScript?: Maybe<Scalars['String']>;
  requestResetPasswordLink?: Maybe<Scalars['String']>;
  resetPassword?: Maybe<LoginSuccess>;
  runAutomation: Job;
  runDataIngestion?: Maybe<Scalars['Boolean']>;
  saveDataset: Dataset;
  saveGeneralWorkspaceSettings: GeneralWorkspaceSettings;
  saveMlModel: MlModel;
  saveMlModelSettings: Array<MlModelSetting>;
  saveProjectWorkspaceSettings: TextDocumentSettings;
  saveSearchKeyword: SearchHistoryKeyword;
  scheduleDeleteProjects: Array<Project>;
  setCommentResolved: Comment;
  signUp?: Maybe<LoginSuccess>;
  submitEmail: WelcomeEmail;
  toggleArchiveProjects: Array<Project>;
  toggleCabinetStatus: Cabinet;
  toggleDocumentStatus: TextDocument;
  triggerSaveMlModel: Scalars['Boolean'];
  triggerTaskCompleted?: Maybe<Scalars['Boolean']>;
  updateConflicts: UpdateConflictsResult;
  updateCustomAPI: CustomApi;
  updateDataset: Dataset;
  updateDocumentAnswers: UpdateDocumentAnswersResult;
  updateDocumentMeta: Array<DocumentMeta>;
  updateDocumentMetaDisplayed: DocumentMeta;
  updateDocumentMetaLabelerRestricted: DocumentMeta;
  updateDocumentMetas: Array<DocumentMeta>;
  updateDocumentQuestion: Question;
  updateDocumentQuestions: Array<Question>;
  updateFileTransformer: FileTransformer;
  /** Updates the specified labelset template. */
  updateLabelSetTemplate?: Maybe<LabelSetTemplate>;
  updateLabelingFunction: LabelingFunction;
  updateLabels: UpdateLabelsResult;
  updateLastOpenedDocument: Cabinet;
  updateMultiRowAnswers: UpdateMultiRowAnswersResult;
  updateProject: Project;
  updateProjectBBoxLabelSet: BBoxLabelSet;
  updateProjectExtension?: Maybe<ProjectExtension>;
  updateProjectExtensionElementSetting?: Maybe<ExtensionElement>;
  updateProjectGuideline: Project;
  /** Updates a specific project's labelset. */
  updateProjectLabelSet: LabelSet;
  /** Update a project labelset to use labelset template. */
  updateProjectLabelSetByLabelSetTemplate: LabelSet;
  updateProjectSettings: Project;
  updateProjectTemplate: ProjectTemplate;
  updateProjectTemplatesOrdering: Array<ProjectTemplate>;
  updateQuestionSet: QuestionSet;
  updateQuestionSetTemplate: QuestionSetTemplate;
  updateQuestions: Array<Question>;
  updateReviewDocumentMetas: Array<DocumentMeta>;
  updateRowAnswers: UpdateRowAnswersResult;
  updateRowQuestion: Question;
  updateRowQuestions: Array<Question>;
  updateSentenceConflict: UpdateSentenceConflictResult;
  /**
   * Deprecated. Please use `updateRowAnswers`.
   * @deprecated Deprecated. Please use `updateRowAnswers`.
   */
  updateSentenceDocLabels: UpdateSentenceDocLabelsResult;
  updateTag: Tag;
  updateTeam: Team;
  updateTeamMemberTeamRole?: Maybe<TeamMember>;
  updateTeamSetting: Team;
  /** Updates a specific document. */
  updateTextDocument: TextDocument;
  updateTextDocumentLabels: TextDocument;
  updateTextDocumentSettings: TextDocumentSettings;
  updateTokenLabels: TextDocument;
  upsertBBoxLabels: Array<BBoxLabel>;
  upsertBoundingBox: Array<BoundingBoxLabel>;
  upsertOauthClient?: Maybe<UpsertOauthClientResult>;
  upsertTimestampLabels: Array<TimestampLabel>;
  wipeProject: Scalars['Boolean'];
  wipeProjects: Array<Scalars['String']>;
};


export type MutationAcceptBoundingBoxConflictArgs = {
  boundingBoxLabelIds: Array<Scalars['ID']>;
  documentId: Scalars['ID'];
};


export type MutationAcceptInvitationArgs = {
  invitationKey: Scalars['String'];
};


export type MutationAcceptTimestampLabelConflictsArgs = {
  documentId: Scalars['ID'];
  labelIds: Array<Scalars['ID']>;
};


export type MutationActivateUserArgs = {
  activationCode: Scalars['String'];
  email: Scalars['String'];
};


export type MutationAddActiveDurationArgs = {
  input: AddActiveDurationInput;
};


export type MutationAddFileToDatasetArgs = {
  input: AddFileToDatasetInput;
};


export type MutationAddLabelingFunctionArgs = {
  input: AddLabelingFunctionInput;
};


export type MutationAddTextDocumentLabelsArgs = {
  inputs: Array<UpdateTextDocumentLabelsInput>;
  textDocumentId: Scalars['String'];
};


export type MutationAllowIPsArgs = {
  allowedIPs: Array<Scalars['String']>;
};


export type MutationAppendLabelSetTagItemsArgs = {
  input: AppendLabelSetTagItemsInput;
};


export type MutationAutoLabelReviewTextDocumentBasedOnConsensusArgs = {
  input: AutoLabelReviewTextDocumentBasedOnConsensusInput;
};


export type MutationAutoLabelTokenBasedProjectArgs = {
  input: AutoLabelTokenBasedProjectInput;
};


export type MutationAwsMarketplaceReportMeteredRecordsArgs = {
  timestamp: Scalars['String'];
};


export type MutationAwsMarketplaceSubscriptionArgs = {
  input: AwsMarketplaceSubscriptionInput;
};


export type MutationBulkSetPasswordsExpiredAtArgs = {
  passwordExpiredAt?: InputMaybe<Scalars['DateTime']>;
  userIds: Array<Scalars['String']>;
};


export type MutationCalculateAgreementTablesArgs = {
  projectId: Scalars['ID'];
};


export type MutationCalculatePairKappasArgs = {
  projectIds: Array<Scalars['ID']>;
};


export type MutationClearAllLabelsOnTextDocumentArgs = {
  documentId: Scalars['ID'];
};


export type MutationClearAllSpanAndArrowLabelsArgs = {
  documentId: Scalars['ID'];
};


export type MutationCollectDatasetArgs = {
  input: CollectDatasetInput;
};


export type MutationCreateCommentArgs = {
  documentId: Scalars['ID'];
  hashCode: Scalars['String'];
  message: Scalars['String'];
};


export type MutationCreateCustomApiArgs = {
  input: CreateCustomApiInput;
  teamId: Scalars['ID'];
};


export type MutationCreateExternalObjectStorageArgs = {
  input: CreateExternalObjectStorageInput;
};


export type MutationCreateFileTransformerArgs = {
  input: CreateFileTransformerInput;
};


export type MutationCreateGuidelineArgs = {
  content: Scalars['String'];
  name: Scalars['String'];
  teamId?: InputMaybe<Scalars['ID']>;
};


export type MutationCreateLabelSetArgs = {
  input: CreateLabelSetInput;
  projectId?: InputMaybe<Scalars['ID']>;
};


export type MutationCreateLabelSetTemplateArgs = {
  input: CreateLabelSetTemplateInput;
};


export type MutationCreatePersonalTagArgs = {
  input: CreatePersonalTagInput;
};


export type MutationCreateProjectTemplateArgs = {
  input: CreateProjectTemplateInput;
};


export type MutationCreateQuestionSetArgs = {
  input: CreateQuestionSetInput;
};


export type MutationCreateQuestionSetTemplateArgs = {
  input?: InputMaybe<QuestionSetTemplateInput>;
  teamId: Scalars['ID'];
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateTagsIfNotExistArgs = {
  input: CreateTagsIfNotExistInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationDeleteBBoxLabelsArgs = {
  documentId: Scalars['ID'];
  labelIds: Array<Scalars['ID']>;
};


export type MutationDeleteBoundingBoxArgs = {
  boundingBoxLabelIds: Array<Scalars['ID']>;
  documentId: Scalars['ID'];
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['ID'];
};


export type MutationDeleteCustomApiArgs = {
  customAPIId: Scalars['ID'];
};


export type MutationDeleteDatasetArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDocumentAnswersArgs = {
  documentId: Scalars['ID'];
};


export type MutationDeleteDocumentBoundLabelsArgs = {
  documentId: Scalars['ID'];
};


export type MutationDeleteExtensionElementArgs = {
  input: DeleteExtensionElementInput;
};


export type MutationDeleteExternalObjectStorageArgs = {
  externalObjectStorageId: Scalars['ID'];
};


export type MutationDeleteGuidelineArgs = {
  id: Scalars['String'];
};


export type MutationDeleteLabelSetArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteLabelSetTemplatesArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteLabelingFunctionsArgs = {
  labelingFunctionIds: Array<Scalars['ID']>;
};


export type MutationDeleteLabelsOnTextDocumentArgs = {
  input: DeleteLabelsOnTextDocumentInput;
};


export type MutationDeleteMlModelArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProjectArgs = {
  input: DeleteProjectInput;
};


export type MutationDeleteProjectTemplatesArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteProjectsArgs = {
  projectIds: Array<Scalars['String']>;
};


export type MutationDeleteQuestionSetArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteQuestionSetsArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteRowAnswersArgs = {
  documentId: Scalars['ID'];
  line: Scalars['Int'];
};


export type MutationDeleteSentenceArgs = {
  documentId: Scalars['String'];
  sentenceId: Scalars['Int'];
  signature: Scalars['String'];
};


export type MutationDeleteTextDocumentArgs = {
  textDocumentId: Scalars['String'];
};


export type MutationDeleteTimestampLabelsArgs = {
  documentId: Scalars['ID'];
  labelIds: Array<Scalars['ID']>;
};


export type MutationEditSentenceArgs = {
  input: EditSentenceInput;
};


export type MutationEnableProjectExtensionElementsArgs = {
  input: EnableProjectExtensionElementsInput;
};


export type MutationImportTextDocumentArgs = {
  input: ImportTextDocumentInput;
};


export type MutationInsertSentenceArgs = {
  content: Scalars['String'];
  documentId: Scalars['String'];
  insertTarget: InsertTargetInput;
  signature: Scalars['String'];
  tokenizationMethod?: InputMaybe<TokenizationMethod>;
};


export type MutationInviteTeamMembersArgs = {
  input: InviteTeamMembersInput;
};


export type MutationLaunchTextProjectArgs = {
  input: LaunchTextProjectInput;
};


export type MutationLaunchTextProjectAsyncArgs = {
  input: LaunchTextProjectInput;
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationOverrideSentencesArgs = {
  input: OverrideSentencesInput;
};


export type MutationRedactCellsArgs = {
  input: RedactCellsInput;
  projectId: Scalars['ID'];
};


export type MutationRedactTextDocumentsArgs = {
  originDocumentIds: Array<Scalars['ID']>;
  projectId: Scalars['ID'];
};


export type MutationRejectBoundingBoxConflictArgs = {
  boundingBoxLabelIds: Array<Scalars['ID']>;
  documentId: Scalars['ID'];
};


export type MutationRejectTimestampLabelConflictsArgs = {
  documentId: Scalars['ID'];
  labelIds: Array<Scalars['ID']>;
};


export type MutationRemoveFileTransformerArgs = {
  fileTransformerId: Scalars['ID'];
};


export type MutationRemovePersonalTagsArgs = {
  input: RemovePersonalTagsInput;
};


export type MutationRemoveQuestionSetTemplateArgs = {
  id: Scalars['ID'];
  teamId: Scalars['ID'];
};


export type MutationRemoveSearchKeywordArgs = {
  keyword: Scalars['String'];
};


export type MutationRemoveTagsArgs = {
  input: RemoveTagsInput;
};


export type MutationRemoveTeamMemberArgs = {
  input: RemoveTeamMemberInput;
};


export type MutationRemoveTextDocumentLabelsArgs = {
  inputs: Array<UpdateTextDocumentLabelsInput>;
  textDocumentId: Scalars['String'];
};


export type MutationReplaceProjectAssigneesArgs = {
  input: AssignProjectInput;
};


export type MutationReplyCommentArgs = {
  commentId: Scalars['ID'];
  message: Scalars['String'];
};


export type MutationRequestDemoArgs = {
  requestDemoInput: RequestDemoInput;
};


export type MutationRequestResetPasswordByScriptArgs = {
  input: RequestResetPasswordInput;
};


export type MutationRequestResetPasswordLinkArgs = {
  input: RequestResetPasswordInput;
};


export type MutationResetPasswordArgs = {
  resetPasswordInput: ResetPasswordInput;
};


export type MutationRunAutomationArgs = {
  automationId: Scalars['ID'];
  type: AutomationType;
};


export type MutationSaveDatasetArgs = {
  input: DatasetInput;
};


export type MutationSaveGeneralWorkspaceSettingsArgs = {
  input: SaveGeneralWorkspaceSettingsInput;
};


export type MutationSaveMlModelArgs = {
  input: MlModelInput;
};


export type MutationSaveMlModelSettingsArgs = {
  input: Array<MlModelSettingInput>;
};


export type MutationSaveProjectWorkspaceSettingsArgs = {
  input: SaveProjectWorkspaceSettingsInput;
};


export type MutationSaveSearchKeywordArgs = {
  keyword: Scalars['String'];
};


export type MutationScheduleDeleteProjectsArgs = {
  dueInDays: Scalars['Int'];
  projectIds: Array<Scalars['String']>;
};


export type MutationSetCommentResolvedArgs = {
  commentId: Scalars['ID'];
  resolved: Scalars['Boolean'];
};


export type MutationSignUpArgs = {
  createUserInput: CreateUserInput;
};


export type MutationSubmitEmailArgs = {
  welcomeEmailInput: WelcomeEmailInput;
};


export type MutationToggleArchiveProjectsArgs = {
  projectIds: Array<Scalars['String']>;
};


export type MutationToggleCabinetStatusArgs = {
  projectId: Scalars['ID'];
  role: Role;
  skipValidation?: InputMaybe<Scalars['Boolean']>;
};


export type MutationToggleDocumentStatusArgs = {
  documentId: Scalars['ID'];
  skipValidation?: InputMaybe<Scalars['Boolean']>;
};


export type MutationTriggerSaveMlModelArgs = {
  input?: InputMaybe<MlModelInput>;
};


export type MutationTriggerTaskCompletedArgs = {
  input: TaskCompletedInput;
};


export type MutationUpdateConflictsArgs = {
  input: Array<UpdateConflictsInput>;
  textDocumentId: Scalars['ID'];
};


export type MutationUpdateCustomApiArgs = {
  customAPIId: Scalars['ID'];
  input: UpdateCustomApiInput;
};


export type MutationUpdateDatasetArgs = {
  input: UpdateDatasetInput;
};


export type MutationUpdateDocumentAnswersArgs = {
  answers: Scalars['AnswerScalar'];
  documentId: Scalars['ID'];
};


export type MutationUpdateDocumentMetaArgs = {
  input: Array<DocumentMetaInput>;
  projectId: Scalars['ID'];
};


export type MutationUpdateDocumentMetaDisplayedArgs = {
  cabinetId: Scalars['ID'];
  displayed: Scalars['Boolean'];
  metaId: Scalars['Int'];
};


export type MutationUpdateDocumentMetaLabelerRestrictedArgs = {
  labelerRestricted: Scalars['Boolean'];
  metaId: Scalars['Int'];
  projectId: Scalars['ID'];
};


export type MutationUpdateDocumentMetasArgs = {
  input?: InputMaybe<UpdateDocumentMetasInput>;
};


export type MutationUpdateDocumentQuestionArgs = {
  input: QuestionInput;
  projectId: Scalars['ID'];
};


export type MutationUpdateDocumentQuestionsArgs = {
  input: Array<QuestionInput>;
  projectId: Scalars['ID'];
};


export type MutationUpdateFileTransformerArgs = {
  input: UpdateFileTransformerInput;
};


export type MutationUpdateLabelSetTemplateArgs = {
  input: UpdateLabelSetTemplateInput;
};


export type MutationUpdateLabelingFunctionArgs = {
  input: UpdateLabelingFunctionInput;
};


export type MutationUpdateLabelsArgs = {
  input: UpdateTokenLabelsInput;
};


export type MutationUpdateLastOpenedDocumentArgs = {
  cabinetId: Scalars['ID'];
  documentId: Scalars['ID'];
};


export type MutationUpdateMultiRowAnswersArgs = {
  input: UpdateMultiRowAnswersInput;
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};


export type MutationUpdateProjectBBoxLabelSetArgs = {
  input: BBoxLabelSetInput;
};


export type MutationUpdateProjectExtensionArgs = {
  input: UpdateProjectExtensionInput;
};


export type MutationUpdateProjectExtensionElementSettingArgs = {
  input: UpdateProjectExtensionElementSettingInput;
};


export type MutationUpdateProjectGuidelineArgs = {
  input?: InputMaybe<UpdateProjectGuidelineInput>;
};


export type MutationUpdateProjectLabelSetArgs = {
  input: UpdateProjectLabelSetInput;
};


export type MutationUpdateProjectLabelSetByLabelSetTemplateArgs = {
  input: UpdateProjectLabelSetByLabelSetTemplateInput;
};


export type MutationUpdateProjectSettingsArgs = {
  input: UpdateProjectSettingsInput;
};


export type MutationUpdateProjectTemplateArgs = {
  input: UpdateProjectTemplateInput;
};


export type MutationUpdateProjectTemplatesOrderingArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationUpdateQuestionSetArgs = {
  input: UpdateQuestionSetInput;
};


export type MutationUpdateQuestionSetTemplateArgs = {
  id: Scalars['ID'];
  input?: InputMaybe<QuestionSetTemplateInput>;
  teamId: Scalars['ID'];
};


export type MutationUpdateQuestionsArgs = {
  input: Array<QuestionInput>;
  projectId: Scalars['ID'];
};


export type MutationUpdateReviewDocumentMetasArgs = {
  input?: InputMaybe<UpdateReviewDocumentMetasInput>;
};


export type MutationUpdateRowAnswersArgs = {
  answers: Scalars['AnswerScalar'];
  documentId: Scalars['ID'];
  line: Scalars['Int'];
};


export type MutationUpdateRowQuestionArgs = {
  input: QuestionInput;
  projectId: Scalars['ID'];
};


export type MutationUpdateRowQuestionsArgs = {
  input: Array<QuestionInput>;
  projectId: Scalars['ID'];
};


export type MutationUpdateSentenceConflictArgs = {
  labelerId?: InputMaybe<Scalars['Int']>;
  resolved: Scalars['Boolean'];
  sentenceId: Scalars['Int'];
  signature: Scalars['String'];
  textDocumentId: Scalars['ID'];
};


export type MutationUpdateSentenceDocLabelsArgs = {
  docLabelsString: Scalars['String'];
  sentenceId: Scalars['Int'];
  textDocumentId: Scalars['String'];
};


export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
};


export type MutationUpdateTeamArgs = {
  input: UpdateTeamInput;
};


export type MutationUpdateTeamMemberTeamRoleArgs = {
  input: UpdateTeamMemberTeamRoleInput;
};


export type MutationUpdateTeamSettingArgs = {
  input: UpdateTeamSettingInput;
};


export type MutationUpdateTextDocumentArgs = {
  input: UpdateTextDocumentInput;
};


export type MutationUpdateTextDocumentLabelsArgs = {
  inputs: Array<UpdateTextDocumentLabelsInput>;
  textDocumentId: Scalars['String'];
};


export type MutationUpdateTextDocumentSettingsArgs = {
  input?: InputMaybe<UpdateTextDocumentSettingsInput>;
};


export type MutationUpdateTokenLabelsArgs = {
  input: UpdateTokenLabelsInput;
};


export type MutationUpsertBBoxLabelsArgs = {
  documentId: Scalars['ID'];
  labels: Array<BBoxLabelInput>;
};


export type MutationUpsertBoundingBoxArgs = {
  documentId: Scalars['ID'];
  labels: Array<BoundingBoxLabelInput>;
};


export type MutationUpsertTimestampLabelsArgs = {
  documentId: Scalars['ID'];
  labels: Array<TimestampLabelInput>;
};


export type MutationWipeProjectArgs = {
  input: WipeProjectInput;
};


export type MutationWipeProjectsArgs = {
  projectIds: Array<Scalars['String']>;
};

export enum OcrProvider {
  AmazonTextract = 'AMAZON_TEXTRACT',
  ApacheTika = 'APACHE_TIKA',
  Custom = 'CUSTOM',
  GoogleCloudVision = 'GOOGLE_CLOUD_VISION',
  Konvergen = 'KONVERGEN'
}

export type ObjectMeta = {
  __typename?: 'ObjectMeta';
  createdAt?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  sizeInBytes: Scalars['Int'];
};

export enum ObjectStorageClientName {
  AwsS3 = 'AWS_S3',
  AzureBlobStorage = 'AZURE_BLOB_STORAGE',
  GoogleCloudStorage = 'GOOGLE_CLOUD_STORAGE'
}

export type OffsetPageInput = {
  skip: Scalars['Int'];
  take: Scalars['Int'];
};

export enum OrderType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type OverallProjectPerformance = {
  __typename?: 'OverallProjectPerformance';
  completed: Scalars['Int'];
  created: Scalars['Int'];
  inProgress: Scalars['Int'];
  inReview: Scalars['Int'];
  reviewReady: Scalars['Int'];
  total: Scalars['Int'];
};

export type OverrideSentencesInput = {
  documentId: Scalars['ID'];
  labelsToAdd?: InputMaybe<Array<GqlConflictableInput>>;
  labelsToDelete?: InputMaybe<Array<GqlConflictableInput>>;
  sentences: Array<TextSentenceInput>;
};

export enum Package {
  Enterprise = 'ENTERPRISE',
  Free = 'FREE',
  Growth = 'GROWTH'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  nextCursor?: Maybe<Scalars['String']>;
  prevCursor?: Maybe<Scalars['String']>;
};

export type PaginatedAnalyticsDashboardFilterInput = {
  calendarDate?: InputMaybe<Scalars['String']>;
  chartId: Scalars['ID'];
  projectId?: InputMaybe<Scalars['ID']>;
  teamId: Scalars['ID'];
  userId?: InputMaybe<Scalars['ID']>;
};

export type PaginatedAnalyticsDashboardQueryInput = {
  cursor?: InputMaybe<Scalars['String']>;
  filter: PaginatedAnalyticsDashboardFilterInput;
  page?: InputMaybe<OffsetPageInput>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type PaginatedChartDataResponse = PaginatedResponse & {
  __typename?: 'PaginatedChartDataResponse';
  nodes: Array<ChartDataRow>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PaginatedResponse = {
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PairKappa = {
  __typename?: 'PairKappa';
  kappa: Scalars['Float'];
  userId1?: Maybe<Scalars['Int']>;
  userId2?: Maybe<Scalars['Int']>;
};

export type Project = {
  __typename?: 'Project';
  assignees?: Maybe<Array<ProjectAssignment>>;
  completedDate?: Maybe<Scalars['String']>;
  createdDate: Scalars['String'];
  exportedDate?: Maybe<Scalars['String']>;
  guideline?: Maybe<Guideline>;
  id: Scalars['ID'];
  isArchived?: Maybe<Scalars['Boolean']>;
  isOwnerMe: Scalars['Boolean'];
  isReviewByMeAllowed: Scalars['Boolean'];
  labelerCabinets: Array<Cabinet>;
  labelingStatus?: Maybe<Array<LabelingStatus>>;
  name: Scalars['String'];
  performance?: Maybe<ProjectPerformance>;
  purpose: ProjectPurpose;
  reviewCabinet?: Maybe<Cabinet>;
  reviewingStatus: ReviewingStatus;
  rootCabinet: Cabinet;
  /** @deprecated No longer supported */
  rootDocumentId: Scalars['ID'];
  selfLabelingStatus: GqlLabelingStatus;
  settings: ProjectSettings;
  status: GqlProjectStatus;
  tags?: Maybe<Array<Tag>>;
  team?: Maybe<Team>;
  /** @deprecated No longer supported */
  type: Scalars['String'];
  updatedDate: Scalars['String'];
  workspaceSettings: WorkspaceSettings;
};

export type ProjectAssignment = {
  __typename?: 'ProjectAssignment';
  createdAt: Scalars['DateTime'];
  documentIds?: Maybe<Array<Scalars['String']>>;
  documents?: Maybe<Array<TextDocument>>;
  role: ProjectAssignmentRole;
  teamMember: TeamMember;
  updatedAt: Scalars['DateTime'];
};

/** Deprecated. See `LaunchTextProjectInput` and use field `documentAssignments` of type `DocumentAssignmentInput` instead. */
export type ProjectAssignmentByNameInput = {
  /** Document's name to be assigned. */
  documentNames?: InputMaybe<Array<Scalars['String']>>;
  /** We only require one between teamMemberId and email. Use email for simplicity. */
  email?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<ProjectAssignmentRole>;
  /** We only require one between teamMemberId and email. Use teamMember query to retrieve the teamMemberId. */
  teamMemberId?: InputMaybe<Scalars['ID']>;
};

export type ProjectAssignmentInput = {
  documentIds: Array<Scalars['String']>;
  role?: InputMaybe<ProjectAssignmentRole>;
  teamMemberId: Scalars['ID'];
  transferTeamMemberId?: InputMaybe<Scalars['ID']>;
};

export enum ProjectAssignmentRole {
  Labeler = 'LABELER',
  LabelerAndReviewer = 'LABELER_AND_REVIEWER',
  Reviewer = 'REVIEWER'
}

export type ProjectConflictListItem = {
  __typename?: 'ProjectConflictListItem';
  documentId: Scalars['ID'];
  id: Scalars['String'];
  labelerIds: Array<Scalars['Int']>;
  resolved: Scalars['Boolean'];
  type: LabelEntityType;
};

export type ProjectConflictsCountItem = {
  __typename?: 'ProjectConflictsCountItem';
  documentId: Scalars['String'];
  numberOfConflicts: Scalars['Int'];
};

export enum ProjectDynamicReviewMethod {
  AnyOtherTeamMember = 'ANY_OTHER_TEAM_MEMBER',
  AnyReviewer = 'ANY_REVIEWER',
  DedicatedMember = 'DEDICATED_MEMBER'
}

export type ProjectExtension = {
  __typename?: 'ProjectExtension';
  cabinetId: Scalars['ID'];
  elements?: Maybe<Array<ExtensionElement>>;
  id: Scalars['ID'];
  width: Scalars['Int'];
};

export type ProjectFinalReport = {
  __typename?: 'ProjectFinalReport';
  documentFinalReports: Array<DocumentFinalReport>;
  project: Project;
};

/** See [this documentation](https://datasaurai.gitbook.io/datasaur/creating-a-project#task-types). */
export enum ProjectKind {
  BboxBased = 'BBOX_BASED',
  DocumentBased = 'DOCUMENT_BASED',
  RowBased = 'ROW_BASED',
  TokenBased = 'TOKEN_BASED'
}

export type ProjectLaunchJob = {
  __typename?: 'ProjectLaunchJob';
  job: Job;
  name: Scalars['String'];
};

export enum ProjectOrder {
  UpdatedAsc = 'UPDATED_ASC',
  UpdatedDesc = 'UPDATED_DESC'
}

/** Paginated list of projects. */
export type ProjectPaginatedResponse = PaginatedResponse & {
  __typename?: 'ProjectPaginatedResponse';
  /** List of projects. See type `Project`. */
  nodes: Array<Project>;
  pageInfo: PageInfo;
  /** Total number of projects that matches the applied filter */
  totalCount: Scalars['Int'];
};

export type ProjectPerformance = {
  __typename?: 'ProjectPerformance';
  conflicts?: Maybe<Scalars['Int']>;
  effectiveTotalTimeSpent?: Maybe<Scalars['Int']>;
  numberOfAcceptedLabels: Scalars['Int'];
  numberOfDocuments: Scalars['Int'];
  numberOfLines: Scalars['Int'];
  numberOfTokens: Scalars['Int'];
  project?: Maybe<Project>;
  projectId?: Maybe<Scalars['ID']>;
  totalLabelApplied?: Maybe<Scalars['Int']>;
  totalTimeSpent?: Maybe<Scalars['Int']>;
};

export enum ProjectPurpose {
  LabelerTest = 'LABELER_TEST',
  Labeling = 'LABELING',
  Validation = 'VALIDATION'
}

export type ProjectSample = {
  __typename?: 'ProjectSample';
  displayName: Scalars['String'];
  exportableJSON: Scalars['String'];
  id: Scalars['ID'];
};

export type ProjectSettings = {
  __typename?: 'ProjectSettings';
  autoMarkDocumentAsComplete: Scalars['Boolean'];
  conflictResolution: ConflictResolution;
  /** @deprecated Moved under `conflictResolution.consensus` */
  consensus?: Maybe<Scalars['Int']>;
  dynamicReviewMemberId?: Maybe<Scalars['ID']>;
  dynamicReviewMethod?: Maybe<ProjectDynamicReviewMethod>;
  enableDeleteSentence: Scalars['Boolean'];
  enableEditLabelSet: Scalars['Boolean'];
  enableEditSentence: Scalars['Boolean'];
  enableInsertSentence: Scalars['Boolean'];
  hideLabelerNamesDuringReview: Scalars['Boolean'];
  hideLabelsFromInactiveLabelSetDuringReview: Scalars['Boolean'];
  hideOriginalSentencesDuringReview: Scalars['Boolean'];
  hideRejectedLabelsDuringReview: Scalars['Boolean'];
  shouldConfirmUnusedLabelSetItems: Scalars['Boolean'];
};

export type ProjectSettingsInput = {
  /** Enables automated mark document as complete. */
  autoMarkDocumentAsComplete?: InputMaybe<Scalars['Boolean']>;
  conflictResolution?: InputMaybe<ConflictResolutionInput>;
  dynamicReviewMemberId?: InputMaybe<Scalars['ID']>;
  dynamicReviewMethod?: InputMaybe<ProjectDynamicReviewMethod>;
  /** Labelers will be able to delete sentences from labeler mode.  */
  enableDeleteSentence?: InputMaybe<Scalars['Boolean']>;
  /** Labelers will be restricted from adding or removing labels from the label set while labeling. */
  enableEditLabelSet?: InputMaybe<Scalars['Boolean']>;
  /**
   * Labelers will be able to edit the original text while labeling.
   * Setting only this will populate enableInsertSentence & enableDeleteSentence with the same value.
   */
  enableEditSentence?: InputMaybe<Scalars['Boolean']>;
  /** Labelers will be able to add new sentences from labeler mode. */
  enableInsertSentence?: InputMaybe<Scalars['Boolean']>;
  hideLabelerNamesDuringReview?: InputMaybe<Scalars['Boolean']>;
  hideLabelsFromInactiveLabelSetDuringReview?: InputMaybe<Scalars['Boolean']>;
  hideOriginalSentencesDuringReview?: InputMaybe<Scalars['Boolean']>;
  hideRejectedLabelsDuringReview?: InputMaybe<Scalars['Boolean']>;
  /** Skip checking for unused label set item when marking document as complete */
  shouldConfirmUnusedLabelSetItems?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectTemplate = {
  __typename?: 'ProjectTemplate';
  createdAt: Scalars['String'];
  creatorId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  labelSetTemplates: Array<Maybe<LabelSetTemplate>>;
  logoURL?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  projectTemplateProjectSetting: ProjectTemplateProjectSetting;
  projectTemplateProjectSettingId: Scalars['ID'];
  projectTemplateTextDocumentSetting: ProjectTemplateTextDocumentSetting;
  projectTemplateTextDocumentSettingId: Scalars['ID'];
  purpose: ProjectPurpose;
  questionSets: Array<QuestionSet>;
  team: Team;
  teamId: Scalars['ID'];
  updatedAt: Scalars['String'];
};

export type ProjectTemplateProjectSetting = {
  __typename?: 'ProjectTemplateProjectSetting';
  autoMarkDocumentAsComplete: Scalars['Boolean'];
  enableEditLabelSet: Scalars['Boolean'];
  enableEditSentence: Scalars['Boolean'];
  hideLabelerNamesDuringReview: Scalars['Boolean'];
  hideLabelsFromInactiveLabelSetDuringReview: Scalars['Boolean'];
  hideOriginalSentencesDuringReview: Scalars['Boolean'];
  hideRejectedLabelsDuringReview: Scalars['Boolean'];
  shouldConfirmUnusedLabelSetItems: Scalars['Boolean'];
};

export type ProjectTemplateTextDocumentSetting = {
  __typename?: 'ProjectTemplateTextDocumentSetting';
  allTokensMustBeLabeled: Scalars['Boolean'];
  allowArcDrawing: Scalars['Boolean'];
  allowCharacterBasedLabeling: Scalars['Boolean'];
  allowMultiLabels: Scalars['Boolean'];
  anonymizationEntityTypes?: Maybe<Array<Scalars['String']>>;
  anonymizationMaskingMethod?: Maybe<Scalars['String']>;
  anonymizationRegExps?: Maybe<Array<RegularExpression>>;
  autoScrollWhenLabeling: Scalars['Boolean'];
  /**
   * Deprecated. Please use field `fileTransformerId` instead.
   * @deprecated No longer supported
   */
  customScriptId?: Maybe<Scalars['ID']>;
  customTextExtractionAPIId?: Maybe<Scalars['ID']>;
  displayedRows: Scalars['Int'];
  editSentenceTokenizer: Scalars['String'];
  enableAnonymization: Scalars['Boolean'];
  enableTabularMarkdownParsing: Scalars['Boolean'];
  fileTransformerId?: Maybe<Scalars['ID']>;
  firstRowAsHeader?: Maybe<Scalars['Boolean']>;
  hideBoundingBoxIfNoSpanOrArrowLabel: Scalars['Boolean'];
  kind: ProjectKind;
  kinds?: Maybe<Array<ProjectKind>>;
  mediaDisplayStrategy: MediaDisplayStrategy;
  /** @deprecated Please use field `transcriptMethod` instead. */
  ocrMethod?: Maybe<TranscriptMethod>;
  ocrProvider?: Maybe<OcrProvider>;
  sentenceSeparator: Scalars['String'];
  textLabelMaxTokenLength: Scalars['Int'];
  tokenizer: Scalars['String'];
  transcriptMethod?: Maybe<TranscriptMethod>;
  viewer?: Maybe<TextDocumentViewer>;
  viewerConfig?: Maybe<TextDocumentViewerConfig>;
};

export type Query = {
  __typename?: 'Query';
  checkExternalObjectStorageConnection: Scalars['Boolean'];
  countProjectsByExternalObjectStorageId: Scalars['Int'];
  dictionaryLookup: DictionaryResult;
  dictionaryLookupBatch: Array<DictionaryResult>;
  /**
   * Simulates what an export file transformer will do to a document in a project, or to a project sample
   * One of documentId or projectSampleId is required
   */
  executeExportFileTransformer: Scalars['ExportFileTransformerExecuteResult'];
  /** Simulates what an import file transformer will do to an input */
  executeImportFileTransformer: Scalars['ImportFileTransformerExecuteResult'];
  exportChart: ExportRequestResult;
  /** Exports custom report. */
  exportCustomReport: ExportRequestResult;
  exportLabelAccuracyChart: ExportRequestResult;
  /** Exports team IAA. */
  exportTeamIAA: ExportRequestResult;
  /** Exports team overview. */
  exportTeamOverview: ExportRequestResult;
  /** Exports test project result. */
  exportTestProjectResult: ExportRequestResult;
  /** Exports all files in a project. */
  exportTextProject: ExportRequestResult;
  /** Exports a single document / file. */
  exportTextProjectDocument: ExportRequestResult;
  getAllTeams: Array<Team>;
  getAllowedIPs: Array<Scalars['String']>;
  getAnalyticsLastUpdatedAt: Scalars['String'];
  getAutoLabel: Array<AutoLabelTokenBasedOutput>;
  getAutoLabelModels: Array<AutoLabelModel>;
  getAutoLabelRowBased: Array<AutoLabelRowBasedOutput>;
  getBBoxLabelSetsByProject: Array<BBoxLabelSet>;
  getBBoxLabelsByDocument: Array<BBoxLabel>;
  getBoundingBoxConflictList: GetBoundingBoxConflictListResult;
  getBoundingBoxLabels: Array<BoundingBoxLabel>;
  getBoundingBoxPages: Array<BoundingBoxPage>;
  /** Returns the specified project's cabinet. Contains list of documents. To get a project's ID, see `getProjects`. */
  getCabinet: Cabinet;
  getCabinetEditSentenceConflicts: Array<EditSentenceConflict>;
  getCabinetLabelSetsById: Array<LabelSet>;
  /** Returns a paginated list of Cell positions along with its origin document ID. */
  getCellPositionsByMetadata: GetCellPositionsByMetadataPaginatedResponse;
  getCells: GetCellsPaginatedResponse;
  getChartData: Array<ChartDataRow>;
  getCharts: Array<Chart>;
  getComments: GetCommentsResponse;
  getConflictAnswers: Array<ConflictAnswerSentence>;
  getCurrentUserTeamMember: TeamMember;
  getCustomAPI: CustomApi;
  getCustomAPIs: Array<CustomApi>;
  /** Returns custom report metrics group tables. */
  getCustomReportMetricsGroupTables: Array<CustomReportMetricsGroupTable>;
  getDataProgramming?: Maybe<DataProgramming>;
  getDataProgrammingLibraries: DataProgrammingLibraries;
  getDataProgrammingPredictions: Job;
  getDataset?: Maybe<Dataset>;
  getDatasets: DatasetPaginatedResponse;
  getDocumentAnswerConflicts: Array<ConflictAnswer>;
  getDocumentAnswers: DocumentAnswer;
  getDocumentAnswersNew: DocumentAnswer;
  /**
   * TEMPORARY
   * FOR TESTING REGARDING REFACTOR ABEL
   */
  getDocumentAnswersOld: DocumentAnswer;
  getDocumentLabelConflicts: Array<ConflictAnswer>;
  getDocumentMetasByCabinetId: Array<DocumentMeta>;
  getDocumentQuestions: Array<Question>;
  getEditSentenceConflicts: EditSentenceConflict;
  getExportDeliveryStatus: GetExportDeliveryStatusResult;
  getExportable: Scalars['ExportableJSON'];
  getExtensions?: Maybe<Array<Extension>>;
  getExternalFilesByApi: Array<ExternalFile>;
  getExternalObjectMeta: Array<ObjectMeta>;
  getExternalObjectStorages?: Maybe<Array<ExternalObjectStorage>>;
  getFileTransformer: FileTransformer;
  getFileTransformers: Array<FileTransformer>;
  getGeneralWorkspaceSettings: GeneralWorkspaceSettings;
  getGrammarCheckerServiceProviders: Array<GrammarCheckerServiceProvider>;
  getGrammarMistakes: Array<GrammarMistake>;
  getGuidelines: Array<Guideline>;
  getInvalidAnswerInfos: Array<InvalidAnswerInfo>;
  getInvalidDocumentAnswerInfos: Array<InvalidAnswerInfo>;
  getInvalidRowAnswerInfos: Array<InvalidAnswerInfo>;
  /**
   * Get a specific Job by its ID.
   * Can be used to check the status of a `ProjectLaunchJob`.
   */
  getJob?: Maybe<Job>;
  getJobs: Array<Maybe<Job>>;
  getLabelAccuracyChart: Array<Chart>;
  getLabelAccuracyData: Array<ChartDataRow>;
  /** Returns a single labelset template. */
  getLabelSetTemplate?: Maybe<LabelSetTemplate>;
  /** Returns a list of labelset templates. */
  getLabelSetTemplates: GetLabelSetTemplatesResponse;
  getLabelSetsByTeamId: Array<LabelSet>;
  getLabelingFunction: LabelingFunction;
  getLabelingFunctions?: Maybe<Array<LabelingFunction>>;
  getLabelsPaginated: GetLabelsPaginatedResponse;
  getMlModel?: Maybe<MlModel>;
  getMlModels: MlModelPaginatedResponse;
  getOverallProjectPerformance: OverallProjectPerformance;
  getPaginatedChartData: PaginatedChartDataResponse;
  getPaginatedQuestionSets: GetPaginatedQuestionSetResponse;
  getPairKappas: Array<PairKappa>;
  /** Returns a list of personal tags. */
  getPersonalTags: Array<Tag>;
  getPredictedLabels: Array<TextLabel>;
  /** Returns a single project identified by its ID. */
  getProject: Project;
  /** Returns all of the project's cabinets. */
  getProjectCabinets: Array<Cabinet>;
  getProjectConflictList: GetProjectConflictListResult;
  /** Total Project Conflict Count. Returns total label conflicts plus edit sentence conflicts */
  getProjectConflictsCount: Array<ProjectConflictsCountItem>;
  getProjectExtension?: Maybe<ProjectExtension>;
  /** Returns a single project identified by its ID. */
  getProjectSample: ProjectSample;
  /** Returns a list of ProjectSample matching the given name */
  getProjectSamples: Array<ProjectSample>;
  getProjectTemplate: ProjectTemplate;
  getProjectTemplates: Array<ProjectTemplate>;
  /** Returns a paginated list of projects. */
  getProjects: ProjectPaginatedResponse;
  getProjectsFinalReport: Array<ProjectFinalReport>;
  getQuestionSet: QuestionSet;
  getQuestionSetTemplate: QuestionSetTemplate;
  getQuestionSetTemplates: Array<QuestionSetTemplate>;
  getQuestionsByCabinetId: Array<Question>;
  getRowAnalyticEvents: RowAnalyticEventPaginatedResponse;
  getRowAnswerConflicts: Array<RowAnswerConflicts>;
  getRowAnswersNewByLine: GetRowAnswersPaginatedResponse;
  /**
   * TEMPORARY
   * FOR TESTING REGARDING REFACTOR ABEL
   */
  getRowAnswersOldByLine: GetRowAnswersPaginatedResponse;
  getRowAnswersPaginated: GetRowAnswersPaginatedResponse;
  getRowQuestions: Array<Question>;
  getSearchHistoryKeywords: Array<SearchHistoryKeyword>;
  getSpanAndArrowConflictContributorIds: Array<ConflictContributorIds>;
  getSpanAndArrowConflicts: GetSpanAndArrowConflictsPaginatedResponse;
  getSpanAndArrowRejectedLabels: GetSpanAndArrowRejectedLabelsPaginatedResponse;
  /** Returns a list of team-owned tags. */
  getTags: Array<Tag>;
  getTeamDetail: Team;
  getTeamMemberDetail: TeamMember;
  /**
   * Returns the specified team's members.
   * `teamId` can be seen in web UI, visible in the URL (https://datasaur.ai/teams/{teamId}/...)
   * , or obtained via `getAllTeams`.
   */
  getTeamMembers: Array<TeamMember>;
  getTeamMembersPaginated: GetTeamMembersPaginatedResponse;
  getTeamProjectAssignees: Array<ProjectAssignment>;
  getTeamRoles?: Maybe<Array<TeamRole>>;
  getTeamTimelineEvent: Array<TimelineEvent>;
  getTeamTimelineEvents: GetTeamTimelineEventsResponse;
  getTextDocument: TextDocument;
  /** Filter Text Document whose name matches the given regular expression. Returns the Text Document origin ID. */
  getTextDocumentOriginIdsByDocumentName: Array<Scalars['ID']>;
  getTextDocumentSettings: TextDocumentSettings;
  getTextDocumentStatistic: TextDocumentStatistic;
  getTimestampLabels: Array<TimestampLabel>;
  getTimestampLabelsAtTimestamp: Array<TimestampLabel>;
  getTrainingJobs: Array<TrainingJob>;
  getUnusedLabelSetItemInfos: Array<UnusedLabelSetItemInfo>;
  getUsage: Usage;
  /** Generate audiowaveform data for an audio project. Waveform data generated by using https://github.com/bbc/audiowaveform */
  getWaveformPeaks: WaveformPeaks;
  me?: Maybe<User>;
  /**
   * Checks whether the cabinet can be safely mark as completed or not.
   * Returns true if valid, causes error otherwise
   */
  validateCabinet: Scalars['Boolean'];
  verifyBetaKey?: Maybe<Scalars['Boolean']>;
  verifyInvitationLink: InvitationVerificationResult;
  verifyResetPasswordSignature?: Maybe<Scalars['Boolean']>;
};


export type QueryCheckExternalObjectStorageConnectionArgs = {
  input: CreateExternalObjectStorageInput;
};


export type QueryCountProjectsByExternalObjectStorageIdArgs = {
  input: Scalars['String'];
};


export type QueryDictionaryLookupArgs = {
  lang?: InputMaybe<Scalars['String']>;
  word: Scalars['String'];
};


export type QueryDictionaryLookupBatchArgs = {
  lang: Scalars['String'];
  words: Array<Scalars['String']>;
};


export type QueryExecuteExportFileTransformerArgs = {
  documentId?: InputMaybe<Scalars['ID']>;
  fileTransformerId: Scalars['ID'];
  projectSampleId?: InputMaybe<Scalars['ID']>;
};


export type QueryExecuteImportFileTransformerArgs = {
  content: Scalars['String'];
  fileTransformerId: Scalars['ID'];
};


export type QueryExportChartArgs = {
  id: Scalars['ID'];
  input: AnalyticsDashboardQueryInput;
  method?: InputMaybe<ExportChartMethod>;
};


export type QueryExportCustomReportArgs = {
  input: CustomReportBuilderInput;
  teamId: Scalars['String'];
};


export type QueryExportLabelAccuracyChartArgs = {
  id: Scalars['ID'];
  input: AnalyticsDashboardQueryInput;
  method?: InputMaybe<ExportChartMethod>;
};


export type QueryExportTeamIaaArgs = {
  labelSetSignatures?: InputMaybe<Array<Scalars['String']>>;
  projectIds?: InputMaybe<Array<Scalars['ID']>>;
  teamId: Scalars['ID'];
};


export type QueryExportTeamOverviewArgs = {
  input: ExportTeamOverviewInput;
};


export type QueryExportTestProjectResultArgs = {
  input: ExportTestProjectResultInput;
};


export type QueryExportTextProjectArgs = {
  input: ExportTextProjectInput;
};


export type QueryExportTextProjectDocumentArgs = {
  input: ExportTextProjectDocumentInput;
};


export type QueryGetAutoLabelArgs = {
  input?: InputMaybe<AutoLabelTokenBasedInput>;
};


export type QueryGetAutoLabelModelsArgs = {
  input: AutoLabelModelsInput;
};


export type QueryGetAutoLabelRowBasedArgs = {
  input?: InputMaybe<AutoLabelRowBasedInput>;
};


export type QueryGetBBoxLabelSetsByProjectArgs = {
  projectId: Scalars['ID'];
};


export type QueryGetBBoxLabelsByDocumentArgs = {
  documentId: Scalars['ID'];
};


export type QueryGetBoundingBoxConflictListArgs = {
  documentId: Scalars['ID'];
};


export type QueryGetBoundingBoxLabelsArgs = {
  documentId: Scalars['ID'];
  endCellLine?: InputMaybe<Scalars['Int']>;
  startCellLine?: InputMaybe<Scalars['Int']>;
};


export type QueryGetBoundingBoxPagesArgs = {
  documentId: Scalars['ID'];
};


export type QueryGetCabinetArgs = {
  projectId: Scalars['ID'];
  role: Role;
};


export type QueryGetCabinetEditSentenceConflictsArgs = {
  cabinetId: Scalars['ID'];
};


export type QueryGetCabinetLabelSetsByIdArgs = {
  cabinetId: Scalars['ID'];
};


export type QueryGetCellPositionsByMetadataArgs = {
  input: GetCellPositionsByMetadataPaginatedInput;
  projectId: Scalars['ID'];
};


export type QueryGetCellsArgs = {
  documentId: Scalars['ID'];
  input: GetCellsPaginatedInput;
  signature?: InputMaybe<Scalars['String']>;
};


export type QueryGetChartDataArgs = {
  id: Scalars['ID'];
  input: AnalyticsDashboardQueryInput;
};


export type QueryGetChartsArgs = {
  level: ChartLevel;
  teamId: Scalars['ID'];
};


export type QueryGetCommentsArgs = {
  input: GetCommentsInput;
};


export type QueryGetConflictAnswersArgs = {
  input: GetConflictAnswersInput;
};


export type QueryGetCurrentUserTeamMemberArgs = {
  input: GetCurrentUserTeamMemberInput;
};


export type QueryGetCustomApiArgs = {
  customAPIId: Scalars['ID'];
};


export type QueryGetCustomApIsArgs = {
  purpose?: InputMaybe<CustomApiPurpose>;
  teamId: Scalars['ID'];
};


export type QueryGetDataProgrammingArgs = {
  input?: InputMaybe<GetDataProgrammingInput>;
};


export type QueryGetDataProgrammingPredictionsArgs = {
  input: GetDataProgrammingPredictionsInput;
};


export type QueryGetDatasetArgs = {
  id: Scalars['ID'];
};


export type QueryGetDatasetsArgs = {
  input: GetDatasetsPaginatedInput;
};


export type QueryGetDocumentAnswerConflictsArgs = {
  documentId: Scalars['ID'];
};


export type QueryGetDocumentAnswersArgs = {
  documentId: Scalars['ID'];
};


export type QueryGetDocumentAnswersNewArgs = {
  documentId: Scalars['ID'];
};


export type QueryGetDocumentAnswersOldArgs = {
  documentId: Scalars['ID'];
};


export type QueryGetDocumentLabelConflictsArgs = {
  documentId: Scalars['ID'];
};


export type QueryGetDocumentMetasByCabinetIdArgs = {
  cabinetId: Scalars['ID'];
};


export type QueryGetDocumentQuestionsArgs = {
  projectId: Scalars['ID'];
};


export type QueryGetEditSentenceConflictsArgs = {
  documentId: Scalars['ID'];
};


export type QueryGetExportDeliveryStatusArgs = {
  exportId: Scalars['ID'];
};


export type QueryGetExportableArgs = {
  documentId?: InputMaybe<Scalars['ID']>;
};


export type QueryGetExtensionsArgs = {
  cabinetId: Scalars['String'];
};


export type QueryGetExternalFilesByApiArgs = {
  input: GetExternalFilesByApiInput;
};


export type QueryGetExternalObjectMetaArgs = {
  externalObjectStorageId: Scalars['ID'];
  objectKeys: Array<Scalars['String']>;
};


export type QueryGetExternalObjectStoragesArgs = {
  teamId: Scalars['ID'];
};


export type QueryGetFileTransformerArgs = {
  fileTransformerId: Scalars['ID'];
};


export type QueryGetFileTransformersArgs = {
  purpose?: InputMaybe<FileTransformerPurpose>;
  teamId: Scalars['ID'];
};


export type QueryGetGeneralWorkspaceSettingsArgs = {
  projectId: Scalars['ID'];
};


export type QueryGetGrammarMistakesArgs = {
  input: GrammarCheckerInput;
};


export type QueryGetGuidelinesArgs = {
  teamId?: InputMaybe<Scalars['ID']>;
};


export type QueryGetInvalidAnswerInfosArgs = {
  cabinetId: Scalars['ID'];
};


export type QueryGetInvalidDocumentAnswerInfosArgs = {
  cabinetId: Scalars['ID'];
};


export type QueryGetInvalidRowAnswerInfosArgs = {
  cabinetId: Scalars['ID'];
};


export type QueryGetJobArgs = {
  jobId: Scalars['String'];
};


export type QueryGetJobsArgs = {
  jobIds: Array<Scalars['String']>;
};


export type QueryGetLabelAccuracyChartArgs = {
  teamId: Scalars['ID'];
};


export type QueryGetLabelAccuracyDataArgs = {
  input: AnalyticsDashboardQueryInput;
};


export type QueryGetLabelSetTemplateArgs = {
  id: Scalars['ID'];
};


export type QueryGetLabelSetTemplatesArgs = {
  input: GetLabelSetTemplatesPaginatedInput;
};


export type QueryGetLabelSetsByTeamIdArgs = {
  teamId: Scalars['ID'];
};


export type QueryGetLabelingFunctionArgs = {
  labelingFunctionId: Scalars['ID'];
};


export type QueryGetLabelingFunctionsArgs = {
  input: GetLabelingFunctionsInput;
};


export type QueryGetLabelsPaginatedArgs = {
  documentId: Scalars['ID'];
  input: GetLabelsPaginatedInput;
  signature?: InputMaybe<Scalars['String']>;
};


export type QueryGetMlModelArgs = {
  id: Scalars['ID'];
};


export type QueryGetMlModelsArgs = {
  input: GetMlModelsPaginatedInput;
};


export type QueryGetOverallProjectPerformanceArgs = {
  teamId?: InputMaybe<Scalars['ID']>;
};


export type QueryGetPaginatedChartDataArgs = {
  input: PaginatedAnalyticsDashboardQueryInput;
};


export type QueryGetPaginatedQuestionSetsArgs = {
  input: GetPaginatedQuestionSetInput;
};


export type QueryGetPairKappasArgs = {
  labelSetSignatures?: InputMaybe<Array<Scalars['String']>>;
  projectIds?: InputMaybe<Array<Scalars['ID']>>;
  teamId: Scalars['ID'];
};


export type QueryGetPersonalTagsArgs = {
  input?: InputMaybe<GetPersonalTagsInput>;
};


export type QueryGetPredictedLabelsArgs = {
  input: GetPredictedLabelsInput;
};


export type QueryGetProjectArgs = {
  input: GetProjectInput;
};


export type QueryGetProjectCabinetsArgs = {
  projectId: Scalars['ID'];
};


export type QueryGetProjectConflictListArgs = {
  projectId: Scalars['ID'];
};


export type QueryGetProjectConflictsCountArgs = {
  projectId: Scalars['ID'];
  role?: InputMaybe<Role>;
};


export type QueryGetProjectExtensionArgs = {
  cabinetId: Scalars['ID'];
};


export type QueryGetProjectSampleArgs = {
  id: Scalars['ID'];
};


export type QueryGetProjectSamplesArgs = {
  displayName?: InputMaybe<Scalars['String']>;
};


export type QueryGetProjectTemplateArgs = {
  id: Scalars['ID'];
};


export type QueryGetProjectTemplatesArgs = {
  teamId: Scalars['ID'];
};


export type QueryGetProjectsArgs = {
  input: GetProjectsPaginatedInput;
};


export type QueryGetProjectsFinalReportArgs = {
  projectIds: Array<Scalars['ID']>;
};


export type QueryGetQuestionSetArgs = {
  id: Scalars['ID'];
};


export type QueryGetQuestionSetTemplateArgs = {
  id: Scalars['ID'];
  teamId: Scalars['ID'];
};


export type QueryGetQuestionSetTemplatesArgs = {
  teamId: Scalars['ID'];
};


export type QueryGetQuestionsByCabinetIdArgs = {
  cabinetId: Scalars['ID'];
};


export type QueryGetRowAnalyticEventsArgs = {
  input: RowAnalyticEventInput;
};


export type QueryGetRowAnswerConflictsArgs = {
  input?: InputMaybe<GetRowAnswerConflictsInput>;
};


export type QueryGetRowAnswersNewByLineArgs = {
  documentId: Scalars['ID'];
  line: Scalars['Int'];
};


export type QueryGetRowAnswersOldByLineArgs = {
  documentId: Scalars['ID'];
  line: Scalars['Int'];
};


export type QueryGetRowAnswersPaginatedArgs = {
  documentId: Scalars['ID'];
  input?: InputMaybe<GetRowAnswersPaginatedInput>;
  signature?: InputMaybe<Scalars['String']>;
};


export type QueryGetRowQuestionsArgs = {
  projectId: Scalars['ID'];
};


export type QueryGetSpanAndArrowConflictContributorIdsArgs = {
  documentId: Scalars['ID'];
  labelHashCodes: Array<Scalars['String']>;
};


export type QueryGetSpanAndArrowConflictsArgs = {
  documentId: Scalars['ID'];
  input: GetSpanAndArrowConflictsPaginatedInput;
  signature?: InputMaybe<Scalars['String']>;
};


export type QueryGetSpanAndArrowRejectedLabelsArgs = {
  documentId: Scalars['ID'];
  input: GetSpanAndArrowRejectedLabelsPaginatedInput;
  signature?: InputMaybe<Scalars['String']>;
};


export type QueryGetTagsArgs = {
  input: GetTagsInput;
};


export type QueryGetTeamDetailArgs = {
  input?: InputMaybe<GetTeamDetailInput>;
};


export type QueryGetTeamMemberDetailArgs = {
  memberId: Scalars['ID'];
  teamId: Scalars['ID'];
};


export type QueryGetTeamMembersArgs = {
  teamId: Scalars['ID'];
};


export type QueryGetTeamMembersPaginatedArgs = {
  input: GetTeamMembersPaginatedInput;
};


export type QueryGetTeamProjectAssigneesArgs = {
  input: GetTeamProjectAssigneesInput;
};


export type QueryGetTeamTimelineEventArgs = {
  teamId: Scalars['ID'];
};


export type QueryGetTeamTimelineEventsArgs = {
  input?: InputMaybe<GetTeamTimelineEventsInput>;
};


export type QueryGetTextDocumentArgs = {
  fileId: Scalars['ID'];
  signature?: InputMaybe<Scalars['String']>;
};


export type QueryGetTextDocumentOriginIdsByDocumentNameArgs = {
  nameRegexString: Scalars['String'];
  projectId: Scalars['ID'];
};


export type QueryGetTextDocumentSettingsArgs = {
  projectId: Scalars['ID'];
};


export type QueryGetTextDocumentStatisticArgs = {
  documentId: Scalars['ID'];
};


export type QueryGetTimestampLabelsArgs = {
  documentId: Scalars['ID'];
  fromTimestampMillis?: InputMaybe<Scalars['Int']>;
};


export type QueryGetTimestampLabelsAtTimestampArgs = {
  documentId: Scalars['ID'];
  timestampMillis?: InputMaybe<Scalars['Int']>;
};


export type QueryGetUnusedLabelSetItemInfosArgs = {
  documentId: Scalars['ID'];
};


export type QueryGetUsageArgs = {
  input: GetUsageInput;
};


export type QueryGetWaveformPeaksArgs = {
  documentId: Scalars['String'];
  pixelPerSecond?: InputMaybe<Scalars['Int']>;
};


export type QueryValidateCabinetArgs = {
  projectId: Scalars['ID'];
  role: Role;
};


export type QueryVerifyBetaKeyArgs = {
  key: Scalars['String'];
};


export type QueryVerifyInvitationLinkArgs = {
  invitationKey: Scalars['String'];
  teamId: Scalars['String'];
};


export type QueryVerifyResetPasswordSignatureArgs = {
  signature: Scalars['String'];
};

export type Question = {
  __typename?: 'Question';
  activationConditionLogic?: Maybe<Scalars['String']>;
  bindToColumn?: Maybe<Scalars['String']>;
  config: QuestionConfig;
  id: Scalars['Int'];
  label: Scalars['String'];
  name: Scalars['String'];
  required: Scalars['Boolean'];
  type: QuestionType;
};

export type QuestionConfig = {
  __typename?: 'QuestionConfig';
  defaultValue?: Maybe<Scalars['String']>;
  format?: Maybe<Scalars['String']>;
  hint?: Maybe<Scalars['String']>;
  max?: Maybe<Scalars['Int']>;
  maxLength?: Maybe<Scalars['Int']>;
  min?: Maybe<Scalars['Int']>;
  minLength?: Maybe<Scalars['Int']>;
  multiline?: Maybe<Scalars['Boolean']>;
  multiple?: Maybe<Scalars['Boolean']>;
  options?: Maybe<Array<QuestionConfigOptions>>;
  pattern?: Maybe<Scalars['String']>;
  questions?: Maybe<Array<Question>>;
  step?: Maybe<Scalars['Int']>;
  theme?: Maybe<SliderTheme>;
};

export type QuestionConfigInput = {
  /** Applies for DATE, TIME. Possible value `NOW` */
  defaultValue?: InputMaybe<Scalars['String']>;
  /** Applies for DATE, TIME. Possible values for DATE are `DD-MM-YYYY`, `MM-DD-YYYY`, `YYYY-MM-DD` `DD/MM/YYYY`, `MM/DD/YYYY` and `YYYY/MM/DD`. Possible values for TIME are `HH:mm:ss`, `HH:mm`, `HH.mm.ss`, and `HH.mm` */
  format?: InputMaybe<Scalars['String']>;
  /** Applies for CHECKBOX. */
  hint?: InputMaybe<Scalars['String']>;
  /** Applies for SLIDER. */
  max?: InputMaybe<Scalars['Int']>;
  /** Applies for TEXT. */
  maxLength?: InputMaybe<Scalars['Int']>;
  /** Applies for SLIDER. */
  min?: InputMaybe<Scalars['Int']>;
  /** Applies for TEXT. */
  minLength?: InputMaybe<Scalars['Int']>;
  /** Applies for TEXT. Set it as true if you want to enter long text. */
  multiline?: InputMaybe<Scalars['Boolean']>;
  /** Applies for TEXT, NESTED, DROPDOWN, HIERARCHICAL_DROPDOWN. Set it as true if you want to have multiple answers for this question. */
  multiple?: InputMaybe<Scalars['Boolean']>;
  /** Applies for Dropdown, HIERARCHICAL_DROPDOWN. */
  options?: InputMaybe<Array<QuestionConfigOptionsInput>>;
  /** Applies for TEXT. This field could have contain a regex string, which the browser natively uses for validation. E.g. `[0-9]*` */
  pattern?: InputMaybe<Scalars['String']>;
  /** Applies for NESTED. */
  questions?: InputMaybe<Array<QuestionInput>>;
  /** Applies for SLIDER. */
  step?: InputMaybe<Scalars['Int']>;
  /** Applies for SLIDER. */
  theme?: InputMaybe<SliderTheme>;
};

export type QuestionConfigOptions = {
  __typename?: 'QuestionConfigOptions';
  id: Scalars['ID'];
  label: Scalars['String'];
  parentId?: Maybe<Scalars['ID']>;
  questionId: Scalars['ID'];
};

export type QuestionConfigOptionsInput = {
  id: Scalars['ID'];
  label: Scalars['String'];
  /** Optional. Use this field if you want to create hierarchical options. Use another option's id to make it as a parent option. */
  parentId?: InputMaybe<Scalars['ID']>;
};

export type QuestionInput = {
  /** Custom activation logic */
  activationConditionLogic?: InputMaybe<Scalars['String']>;
  bindToColumn?: InputMaybe<Scalars['String']>;
  config?: InputMaybe<QuestionConfigInput>;
  /** Set to true to delete the question when updating the document. */
  delete?: InputMaybe<Scalars['Boolean']>;
  /** Only for update. */
  id?: InputMaybe<Scalars['Int']>;
  /** Message shown to Labeler. */
  label?: InputMaybe<Scalars['String']>;
  /** Column name. */
  name?: InputMaybe<Scalars['String']>;
  /** This marks whether the question is required to answer or not. */
  required?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<QuestionType>;
};

export type QuestionSet = {
  __typename?: 'QuestionSet';
  createdAt: Scalars['String'];
  creator?: Maybe<User>;
  id: Scalars['ID'];
  items: Array<QuestionSetItem>;
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type QuestionSetItem = {
  __typename?: 'QuestionSetItem';
  activationConditionLogic?: Maybe<Scalars['String']>;
  bindToColumn?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  defaultValue?: Maybe<DateTimeDefaultValue>;
  format?: Maybe<Scalars['String']>;
  hint?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  index: Scalars['Int'];
  label: Scalars['String'];
  max?: Maybe<Scalars['Int']>;
  maxLength?: Maybe<Scalars['Int']>;
  min?: Maybe<Scalars['Int']>;
  minLength?: Maybe<Scalars['Int']>;
  multiline?: Maybe<Scalars['Boolean']>;
  multipleAnswer?: Maybe<Scalars['Boolean']>;
  nestedQuestions?: Maybe<Array<QuestionSetItem>>;
  options?: Maybe<Array<DropdownConfigOptions>>;
  parentId?: Maybe<Scalars['ID']>;
  pattern?: Maybe<Scalars['String']>;
  questionSetId: Scalars['String'];
  required: Scalars['Boolean'];
  step?: Maybe<Scalars['Int']>;
  theme?: Maybe<SliderTheme>;
  type: QuestionType;
  updatedAt: Scalars['String'];
};

export type QuestionSetItemInput = {
  activationConditionLogic?: InputMaybe<Scalars['String']>;
  config: QuestionSetItemInputConfig;
  label: Scalars['String'];
  required?: InputMaybe<Scalars['Boolean']>;
  type: QuestionType;
};

export type QuestionSetItemInputConfig = {
  defaultValue?: InputMaybe<DateTimeDefaultValue>;
  format?: InputMaybe<Scalars['String']>;
  hint?: InputMaybe<Scalars['String']>;
  max?: InputMaybe<Scalars['Int']>;
  maxLength?: InputMaybe<Scalars['Int']>;
  min?: InputMaybe<Scalars['Int']>;
  minLength?: InputMaybe<Scalars['Int']>;
  multiline?: InputMaybe<Scalars['Boolean']>;
  multiple?: InputMaybe<Scalars['Boolean']>;
  options?: InputMaybe<Array<DropdownConfigOptionsInput>>;
  pattern?: InputMaybe<Scalars['String']>;
  questions?: InputMaybe<Array<QuestionSetItemInput>>;
  step?: InputMaybe<Scalars['Int']>;
  theme?: InputMaybe<SliderTheme>;
};

export type QuestionSetTemplate = {
  __typename?: 'QuestionSetTemplate';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  teamId: Scalars['ID'];
  template: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type QuestionSetTemplateInput = {
  name: Scalars['String'];
  template: Scalars['String'];
};

/** See [this documentation](https://datasaurai.gitbook.io/datasaur/creating-a-project#question-types) for further information. */
export enum QuestionType {
  /** This type provides a checkbox. */
  Checkbox = 'CHECKBOX',
  Data = 'DATA',
  /** This type provides a date picker. */
  Date = 'DATE',
  /** This type provides a dropdown with multiple options. */
  Dropdown = 'DROPDOWN',
  /** This type provides a dropdown with hierarchical options. */
  HierarchicalDropdown = 'HIERARCHICAL_DROPDOWN',
  /** You can create nested questions. Questions inside a question by using this type. */
  Nested = 'NESTED',
  /** This type provides a slider with customizeable minimum value and maximum value. */
  Slider = 'SLIDER',
  /** This type provides a text area. */
  Text = 'TEXT',
  /** This type provides a time picker. */
  Time = 'TIME',
  /** This type provides a token field. */
  Token = 'TOKEN',
  /** This type provides a URL field. */
  Url = 'URL'
}

export type RangeInput = {
  end: Scalars['Int'];
  start: Scalars['Int'];
};

export type RangePageInput = {
  end: Scalars['Int'];
  start: Scalars['Int'];
};

export type RedactCellsInput = {
  cellPositions: Array<CellPositionWithOriginDocumentIdInput>;
};

export type RegularExpression = {
  __typename?: 'RegularExpression';
  /** Optional flags (d, g, i, m, s, u, y) that allow for functionality like global searching and case-insensitive searching e.g. g, i, gi' */
  flags?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  pattern: Scalars['String'];
};

export type RegularExpressionInput = {
  /** Optional flags (d, g, i, m, s, u, y) that allow for functionality like global searching and case-insensitive searching e.g. g, i, gi' */
  flags?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  pattern: Scalars['String'];
};

export type RejectedLabel = {
  __typename?: 'RejectedLabel';
  label: TextLabel;
  reason: Scalars['String'];
};

export type RemovePersonalTagsInput = {
  tagIds: Array<Scalars['ID']>;
};

export type RemoveTagsInput = {
  tagIds: Array<Scalars['ID']>;
  teamId?: InputMaybe<Scalars['ID']>;
};

export type RemoveTagsResult = {
  __typename?: 'RemoveTagsResult';
  tagId: Scalars['ID'];
};

export type RemoveTeamMemberInput = {
  teamMemberId: Scalars['ID'];
};

export type RequestDemo = {
  __typename?: 'RequestDemo';
  company: Scalars['String'];
  desiredLabelingFeature?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  fbclid?: Maybe<Scalars['String']>;
  gclid?: Maybe<Scalars['String']>;
  givenName: Scalars['String'];
  /** @deprecated Please use givenName and surname instead. */
  name?: Maybe<Scalars['String']>;
  numberOfLabelers: Scalars['Int'];
  surname: Scalars['String'];
  utmSource?: Maybe<Scalars['String']>;
};

export type RequestDemoInput = {
  company: Scalars['String'];
  desiredLabelingFeature?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  fbclid?: InputMaybe<Scalars['String']>;
  gclid?: InputMaybe<Scalars['String']>;
  givenName: Scalars['String'];
  numberOfLabelers: Scalars['Int'];
  recaptcha?: InputMaybe<Scalars['String']>;
  requireCaptcha: Scalars['Boolean'];
  surname: Scalars['String'];
  utmSource?: InputMaybe<Scalars['String']>;
};

export type RequestResetPasswordInput = {
  email: Scalars['String'];
  recaptcha?: InputMaybe<Scalars['String']>;
};

export type ResetPasswordInput = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  signature: Scalars['String'];
};

export type ReviewingStatus = {
  __typename?: 'ReviewingStatus';
  isCompleted: Scalars['Boolean'];
  statistic: ReviewingStatusStatistic;
};

export type ReviewingStatusStatistic = {
  __typename?: 'ReviewingStatusStatistic';
  numberOfDocuments: Scalars['Int'];
  numberOfLabeledDocuments: Scalars['Int'];
};

export enum Role {
  Labeler = 'LABELER',
  Reviewer = 'REVIEWER'
}

export type RowAnalyticEvent = {
  __typename?: 'RowAnalyticEvent';
  cell: RowAnalyticEventCell;
  createdAt: Scalars['String'];
  event: RowAnalyticEventType;
  id: Scalars['String'];
  user: RowAnalyticEventUser;
};

export type RowAnalyticEventCell = {
  __typename?: 'RowAnalyticEventCell';
  conflict: Scalars['Boolean'];
  content: Scalars['String'];
  document: RowAnalyticEventDocument;
  index: Scalars['Int'];
  line: Scalars['Int'];
  status: CellStatus;
};

export type RowAnalyticEventDocument = {
  __typename?: 'RowAnalyticEventDocument';
  fileName: Scalars['String'];
  id: Scalars['ID'];
  project: RowAnalyticEventProject;
};

export type RowAnalyticEventInput = {
  cursor?: InputMaybe<Scalars['String']>;
  filter: RowAnalyticEventInputFilter;
  page?: InputMaybe<CursorPageInput>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type RowAnalyticEventInputFilter = {
  endDate?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['String']>;
  teamId: Scalars['String'];
};

export type RowAnalyticEventPaginatedResponse = PaginatedResponse & {
  __typename?: 'RowAnalyticEventPaginatedResponse';
  nodes: Array<RowAnalyticEvent>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type RowAnalyticEventProject = {
  __typename?: 'RowAnalyticEventProject';
  id: Scalars['String'];
  name: Scalars['String'];
};

export enum RowAnalyticEventType {
  RowBasedRowLabeled = 'ROW_BASED_ROW_LABELED',
  RowHighlighted = 'ROW_HIGHLIGHTED'
}

export type RowAnalyticEventUser = {
  __typename?: 'RowAnalyticEventUser';
  email: Scalars['String'];
  id: Scalars['ID'];
  roleName: Scalars['String'];
};

export type RowAnswer = {
  __typename?: 'RowAnswer';
  answers: Scalars['AnswerScalar'];
  documentId: Scalars['ID'];
  line: Scalars['Int'];
};

export type RowAnswerConflicts = {
  __typename?: 'RowAnswerConflicts';
  conflicts: Array<Scalars['ConflictAnswerScalar']>;
  line: Scalars['Int'];
};

export type RowAnswersInput = {
  answers: Scalars['AnswerScalar'];
  line: Scalars['Int'];
};

export type RowFinalReport = {
  __typename?: 'RowFinalReport';
  finalReport: FinalReport;
  line: Scalars['Int'];
};

export type SaveGeneralWorkspaceSettingsInput = {
  projectId: Scalars['ID'];
  settings: GeneralWorkspaceSettingsInput;
};

export type SaveProjectWorkspaceSettingsInput = {
  projectId: Scalars['ID'];
  settings: TextDocumentSettingsInput;
};

export type SearchHistoryKeyword = {
  __typename?: 'SearchHistoryKeyword';
  id: Scalars['ID'];
  keyword: Scalars['String'];
};

export type SentenceConflict = {
  __typename?: 'SentenceConflict';
  resolved: Scalars['Boolean'];
  resolvingLabelerId?: Maybe<Scalars['Int']>;
  sentences: Array<SentenceConflictObject>;
};

export type SentenceConflictObject = {
  __typename?: 'SentenceConflictObject';
  content: Scalars['String'];
  docLabels?: Maybe<Array<DocLabelObject>>;
  labelerId: Scalars['Int'];
  posLabels: Array<TextLabel>;
  status?: Maybe<TextSentenceStatus>;
  tokens: Array<Scalars['String']>;
};

export type Settings = {
  __typename?: 'Settings';
  textLang?: Maybe<Scalars['String']>;
};

export type SettingsInput = {
  /** Optional */
  documentMeta?: InputMaybe<Array<DocumentMetaInput>>;
  /** Required */
  questions?: InputMaybe<Array<QuestionInput>>;
  /** Optional. Default is `en`. */
  textLang?: InputMaybe<Scalars['String']>;
};

export enum SliderTheme {
  /** Slider with multiple colors theme; Red, yellow, green */
  Gradient = 'GRADIENT',
  /** Default slider theme */
  Plain = 'PLAIN'
}

export type SortInput = {
  field: Scalars['String'];
  order: OrderType;
};

export type Spec = {
  __typename?: 'Spec';
  chunkMaxSize: Scalars['Int'];
  chunkMinSize: Scalars['Int'];
  tokenizationRegex: Scalars['String'];
};

export type SplitDocumentOptionInput = {
  /**
   * Required. Depends on strategy.
   * If `strategy` is
   * - `BY_PARTS`, `number` is the amount of parts to generate.
   * - `DONT_SPLIT`, `number` is ignored.
   */
  number: Scalars['Int'];
  /** Required. The split strategy. */
  strategy: SplitDocumentStrategy;
};

export enum SplitDocumentStrategy {
  ByParts = 'BY_PARTS',
  DontSplit = 'DONT_SPLIT'
}

export type StatisticItem = {
  __typename?: 'StatisticItem';
  key: Scalars['String'];
  values: Array<StatisticItemValue>;
};

export type StatisticItemValue = {
  __typename?: 'StatisticItemValue';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type Tag = {
  __typename?: 'Tag';
  globalTag: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type TagItem = {
  __typename?: 'TagItem';
  /** Only has effect if type is ARROW. */
  arrowRules?: Maybe<Array<LabelClassArrowRule>>;
  /** 6 digit hex string, prefixed by #. Example: #df3920. */
  color?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['String']>;
  /** Unique identifier of the labelset item. */
  id: Scalars['String'];
  /** Parent item ID. Used in hierarchical labelsets. */
  parentId?: Maybe<Scalars['ID']>;
  /** Labelset item name, displayed in web UI. Case insensitive. */
  tagName: Scalars['String'];
  /** Can be SPAN, ARROW, or ALL. Defaults to ALL. */
  type: LabelClassType;
};

export type TagItemInput = {
  /** Optional. Only has effect if type is ARROW. */
  arrowRules?: InputMaybe<Array<LabelClassArrowRuleInput>>;
  /** Optional. 6 digit hex string, prefixed by #. Example: #df3920. */
  color?: InputMaybe<Scalars['String']>;
  /** Optional. Description of the labelset item. */
  desc?: InputMaybe<Scalars['String']>;
  /** Required. Unique identifier for the labelset item. */
  id: Scalars['String'];
  /** Optional. Parent item's ID. Used in hierarchical labelsets. */
  parentId?: InputMaybe<Scalars['ID']>;
  /** Required. The text to be displayed in the web UI. */
  tagName: Scalars['String'];
  /** Optional. Can be SPAN, ARROW, or ALL. Defaults to ALL. */
  type?: InputMaybe<LabelClassType>;
};

export type TargetApiInput = {
  endpoint: Scalars['String'];
  secretKey: Scalars['String'];
};

export type TaskCompletedInput = {
  documentId: Scalars['ID'];
  startedAt: Scalars['String'];
};

export type Team = {
  __typename?: 'Team';
  /** `Team.id` can be seen in web UI, visible in the URL (https://datasaur.ai/teams/{teamId}/...), or obtained via `getAllTeams`. */
  id: Scalars['ID'];
  logoURL?: Maybe<Scalars['String']>;
  members?: Maybe<Array<TeamMember>>;
  name: Scalars['String'];
  setting?: Maybe<TeamSetting>;
};

export type TeamMember = {
  __typename?: 'TeamMember';
  id: Scalars['ID'];
  invitationEmail?: Maybe<Scalars['String']>;
  invitationKey?: Maybe<Scalars['String']>;
  invitationStatus?: Maybe<Scalars['String']>;
  isDeleted: Scalars['Boolean'];
  joinedDate: Scalars['String'];
  performance?: Maybe<TeamMemberPerformance>;
  role?: Maybe<TeamRole>;
  user?: Maybe<User>;
};

export type TeamMemberInput = {
  email: Scalars['String'];
};

export type TeamMemberPerformance = {
  __typename?: 'TeamMemberPerformance';
  accuracy: Scalars['Float'];
  effectiveTotalTimeSpent?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  projectStatistic: TeamMemberProjectStatistic;
  totalTimeSpent?: Maybe<Scalars['Int']>;
  userId: Scalars['Int'];
};

export type TeamMemberProjectStatistic = {
  __typename?: 'TeamMemberProjectStatistic';
  completed: Scalars['Int'];
  created: Scalars['Int'];
  inProgress: Scalars['Int'];
  total: Scalars['Int'];
};

export enum TeamMemberRole {
  Admin = 'ADMIN',
  Reviewer = 'REVIEWER'
}

export type TeamRole = {
  __typename?: 'TeamRole';
  id: Scalars['ID'];
  name: TeamMemberRole;
};

export type TeamSetting = {
  __typename?: 'TeamSetting';
  /** @deprecated No longer supported */
  allowedAdminExportMethods: Array<GqlExportMethod>;
  allowedLabelerExportMethods: Array<GqlExportMethod>;
  allowedOCRProviders: Array<OcrProvider>;
  allowedReviewerExportMethods: Array<GqlExportMethod>;
  customAPICreationLimit: Scalars['Int'];
  defaultCustomTextExtractionAPIId?: Maybe<Scalars['ID']>;
  defaultExternalObjectStorageId?: Maybe<Scalars['ID']>;
  enableAssistedLabeling: Scalars['Boolean'];
  enableDataProgramming: Scalars['Boolean'];
  enableExportTeamOverview: Scalars['Boolean'];
  enableWipeData: Scalars['Boolean'];
};

export type TextChunk = {
  __typename?: 'TextChunk';
  documentId?: Maybe<Scalars['ID']>;
  id: Scalars['Int'];
  sentenceIndexEnd: Scalars['Int'];
  sentenceIndexStart: Scalars['Int'];
  sentences: Array<TextSentence>;
};

export type TextChunkInput = {
  id: Scalars['Int'];
  sentenceIndexEnd: Scalars['Int'];
  sentenceIndexStart: Scalars['Int'];
  sentences: Array<InputMaybe<TextSentenceInput>>;
};

export type TextCursor = {
  __typename?: 'TextCursor';
  charId: Scalars['Int'];
  sentenceId: Scalars['Int'];
  tokenId: Scalars['Int'];
};

export type TextCursorInput = {
  charId: Scalars['Int'];
  sentenceId: Scalars['Int'];
  tokenId: Scalars['Int'];
};

export type TextDocument = {
  __typename?: 'TextDocument';
  chunks: Array<TextChunk>;
  createdAt: Scalars['String'];
  currentSentenceCursor: Scalars['Int'];
  documentSettings?: Maybe<TextDocumentSettings>;
  fileName: Scalars['String'];
  id: Scalars['ID'];
  isCompleted: Scalars['Boolean'];
  lastLabeledLine?: Maybe<Scalars['Int']>;
  lastSavedAt: Scalars['String'];
  mimeType: Scalars['String'];
  name: Scalars['String'];
  originId?: Maybe<Scalars['ID']>;
  part: Scalars['Int'];
  projectId?: Maybe<Scalars['ID']>;
  /**
   * Deprecated. Please use `getRowAnswers`.
   * @deprecated Deprecated. Please use `getRowAnswers`.
   */
  sentences: Array<TextSentence>;
  settings: Settings;
  signature: Scalars['String'];
  statistic: TextDocumentStatistic;
  type: TextDocumentType;
  updatedChunks: Array<TextChunk>;
  updatedTokenLabels: Array<TextLabel>;
  url?: Maybe<Scalars['String']>;
  version: Scalars['Int'];
  workspaceState?: Maybe<WorkspaceState>;
};


export type TextDocumentChunksArgs = {
  end?: InputMaybe<Scalars['Int']>;
  start?: InputMaybe<Scalars['Int']>;
};


export type TextDocumentSentencesArgs = {
  end: Scalars['Int'];
  start: Scalars['Int'];
};

export type TextDocumentSettings = {
  __typename?: 'TextDocumentSettings';
  /** Forces every token to have at least one label in Token Based Labeling. */
  allTokensMustBeLabeled: Scalars['Boolean'];
  /** Enables drawing arrows between labels in Token Based Labeling. */
  allowArcDrawing: Scalars['Boolean'];
  /** Enables character span labeling. */
  allowCharacterBasedLabeling?: Maybe<Scalars['Boolean']>;
  /** Enables placing multiple labels on one character / token span. */
  allowMultiLabels: Scalars['Boolean'];
  anonymizationEntityTypes?: Maybe<Array<Scalars['String']>>;
  /** Masking method for anonymization. One of [`RANDOM_CHARACTER`, `ASTERISK`]. */
  anonymizationMaskingMethod?: Maybe<Scalars['String']>;
  /** Optional. List of regular expressions for getting additional PII entities to anonymize. */
  anonymizationRegExps?: Maybe<Array<RegularExpression>>;
  autoScrollWhenLabeling: Scalars['Boolean'];
  /** How many rows are displayed at once. `-1` displays all rows. */
  displayedRows: Scalars['Int'];
  /** The tokenizer of the document. One of [`WINK`, `WHITE_SPACE`]. */
  editSentenceTokenizer: Scalars['String'];
  enableAnonymization: Scalars['Boolean'];
  enableTabularMarkdownParsing?: Maybe<Scalars['Boolean']>;
  fileTransformerId?: Maybe<Scalars['String']>;
  /** Hide if the bounding box does not have span label corresponded with it */
  hideBoundingBoxIfNoSpanOrArrowLabel?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  /** The project kinds associated with the document. */
  kinds: Array<ProjectKind>;
  mediaDisplayStrategy: MediaDisplayStrategy;
  /**
   * The sentence separator of the document. One of [`
   * `, `.`].
   */
  sentenceSeparator: Scalars['String'];
  /** Number of token that can be covered by one label. */
  textLabelMaxTokenLength: Scalars['Int'];
  /** The tokenizer of the document. One of [`WINK`, `WHITE_SPACE`]. */
  tokenizer: Scalars['String'];
  /** Sets how the Changes accordingly with the task type and/or document type  */
  viewer: TextDocumentViewer;
  viewerConfig?: Maybe<TextDocumentViewerConfig>;
};

/**
 * Configuration parameter for new documents.
 * Used in project creation via mutation `launchTextProjectAsync`.
 */
export type TextDocumentSettingsInput = {
  /** Forces every token to have at least one label in Token Based Labeling. Defaults to `false`. */
  allTokensMustBeLabeled?: InputMaybe<Scalars['Boolean']>;
  /** Enables drawing arrows between labels in Token Based Labeling. Defaults to `false`, disabling the arrow feature. */
  allowArcDrawing?: InputMaybe<Scalars['Boolean']>;
  /** Enables character span labeling. Defaults to `false`, enables token span labeling. */
  allowCharacterBasedLabeling?: InputMaybe<Scalars['Boolean']>;
  /** Enables placing multiple labels on one character / token span. */
  allowMultiLabels?: InputMaybe<Scalars['Boolean']>;
  /** Optional. List of PII entity types to anonymize */
  anonymizationEntityTypes?: InputMaybe<Array<Scalars['String']>>;
  /** Optional. Masking method for anonymization. One of [`RANDOM_CHARACTER`, `ASTERISK`]. */
  anonymizationMaskingMethod?: InputMaybe<Scalars['String']>;
  /** Optional. List of regular expressions for getting additional PII entities to anonymize. */
  anonymizationRegExps?: InputMaybe<Array<RegularExpressionInput>>;
  /** Enables autoscrolling in the web UI. Defaults to `false`. */
  autoScrollWhenLabeling?: InputMaybe<Scalars['Boolean']>;
  /** Optional. Defaults to `null`. */
  customTextExtractionAPIId?: InputMaybe<Scalars['ID']>;
  /** For Row Based Labeling, Determines how many rows are displayed in the editor. Defaults to `-1`, showing all rows. */
  displayedRows?: InputMaybe<Scalars['Int']>;
  /** For Token Based Labeling. One of [`WINK`, `WHITE_SPACE`]. Defaults to `WINK`. */
  editSentenceTokenizer?: InputMaybe<Scalars['String']>;
  /** Optional. Set to true to enable anonymization */
  enableAnonymization?: InputMaybe<Scalars['Boolean']>;
  /** For `.csv` files / row-based task. Enables markdown parsing. Defaults to `false` */
  enableTabularMarkdownParsing?: InputMaybe<Scalars['Boolean']>;
  /** Optional. Sets the file transformer to be used in the project. Defaults to `null`.  */
  fileTransformerId?: InputMaybe<Scalars['ID']>;
  /** Required for `.csv` files / row-based task. Sets the first row of data as header rows. Defaults to `null`. */
  firstRowAsHeader?: InputMaybe<Scalars['Boolean']>;
  /** Deprecated, use kinds to support mixed labeling */
  kind?: InputMaybe<ProjectKind>;
  /** For Row Based Labeling. Defaults to `NONE`. */
  mediaDisplayStrategy?: InputMaybe<MediaDisplayStrategy>;
  /** Deprecated. Please use field `transcriptMethod` instead. */
  ocrMethod?: InputMaybe<TranscriptMethod>;
  /** Optional. For OCR tasks when `transcriptMethod` is set to `CUSTOM_API` . Defaults to `null`. */
  ocrProvider?: InputMaybe<OcrProvider>;
  /**
   * For Token Based Labeling. One of [`'
   * '`, `'.'`]. Defaults to `
   * `.
   */
  sentenceSeparator?: InputMaybe<Scalars['String']>;
  /** Determines how many token that can be covered by one label. Defaults to `999999`. */
  textLabelMaxTokenLength?: InputMaybe<Scalars['Int']>;
  /** For Token Based Labeling. One of [`WINK`, `WHITE_SPACE`]. Defaults to `WINK`. */
  tokenizer?: InputMaybe<Scalars['String']>;
  /** Required for transcription tasks. */
  transcriptMethod?: InputMaybe<TranscriptMethod>;
  /**
   * Sets the viewer in the web UI. Depends upon the task and/or the document type.
   * `TABULAR` view for row-based task (i.e. `.csv` files).
   * `TOKEN` view for token-based task (i.e. `.txt` files).
   * `URL` view for document-based task.
   */
  viewer?: InputMaybe<TextDocumentViewer>;
  viewerConfig?: InputMaybe<TextDocumentViewerConfigInput>;
};

export type TextDocumentStatistic = {
  __typename?: 'TextDocumentStatistic';
  documentId?: Maybe<Scalars['ID']>;
  documentTouched?: Maybe<Scalars['Boolean']>;
  labelerStatisic?: Maybe<Array<LabelerStatistic>>;
  nonDisplayedLines: Array<Scalars['Int']>;
  numberOfChunks: Scalars['Int'];
  numberOfEntitiesLabeled?: Maybe<Scalars['Int']>;
  numberOfNonDocumentEntitiesLabeled?: Maybe<Scalars['Int']>;
  numberOfSentences: Scalars['Int'];
  numberOfTokens: Scalars['Int'];
  touchedSentences?: Maybe<Array<Scalars['Int']>>;
};

export type TextDocumentStatisticInput = {
  numberOfTokens?: InputMaybe<Scalars['Int']>;
  percentCompleted?: InputMaybe<Scalars['Float']>;
  tokensLabeled?: InputMaybe<Scalars['Int']>;
};

/** More complete explanation can be found here in [this page](https://datasaurai.gitbook.io/datasaur/basics/creating-a-project/project-templates) */
export enum TextDocumentType {
  /** Deprecated. Aspect Based Sentiment Analysis */
  Absa = 'ABSA',
  /** Audio Speech Recognition */
  Asr = 'ASR',
  BoundingBox = 'BOUNDING_BOX',
  /** Coreference */
  Coref = 'COREF',
  Custom = 'CUSTOM',
  /** Dependency */
  Dep = 'DEP',
  /** Document Labeling */
  Doc = 'DOC',
  /** Named Entity Recognition */
  Ner = 'NER',
  /** Optical Character Recognition */
  Ocr = 'OCR',
  /** Part of Speech */
  Pos = 'POS'
}

export enum TextDocumentViewer {
  Tabular = 'TABULAR',
  Token = 'TOKEN',
  Url = 'URL'
}

export type TextDocumentViewerConfig = {
  __typename?: 'TextDocumentViewerConfig';
  urlColumnNames?: Maybe<Array<Scalars['String']>>;
};

export type TextDocumentViewerConfigInput = {
  urlColumnNames?: InputMaybe<Array<Scalars['String']>>;
};

export type TextLabel = {
  __typename?: 'TextLabel';
  confidenceScore?: Maybe<Scalars['Float']>;
  deleted?: Maybe<Scalars['Boolean']>;
  documentId?: Maybe<Scalars['String']>;
  end: TextCursor;
  hashCode: Scalars['String'];
  id: Scalars['String'];
  l: Scalars['String'];
  labeledBy?: Maybe<ConflictTextLabelResolutionStrategy>;
  labeledByUser?: Maybe<User>;
  labeledByUserId?: Maybe<Scalars['Int']>;
  layer: Scalars['Int'];
  start: TextCursor;
};

export type TextLabelInput = {
  confidenceScore?: InputMaybe<Scalars['Float']>;
  deleted?: InputMaybe<Scalars['Boolean']>;
  end: TextCursorInput;
  id: Scalars['String'];
  l: Scalars['String'];
  labeledBy?: InputMaybe<ConflictTextLabelResolutionStrategy>;
  layer: Scalars['Int'];
  start: TextCursorInput;
};

export type TextMetadataConfig = {
  __typename?: 'TextMetadataConfig';
  backgroundColor: Scalars['String'];
  borderColor: Scalars['String'];
  color: Scalars['String'];
};

export type TextRange = {
  __typename?: 'TextRange';
  end: TextCursor;
  start: TextCursor;
};

export type TextRangeInput = {
  end: TextCursorInput;
  start: TextCursorInput;
};

export type TextSentence = {
  __typename?: 'TextSentence';
  answers?: Maybe<Array<Answer>>;
  conflictAnswerResolved?: Maybe<ConflictTextLabelResolutionStrategy>;
  conflictAnswers?: Maybe<Array<ConflictAnswer>>;
  conflicts?: Maybe<Array<ConflictTextLabel>>;
  content: Scalars['String'];
  docLabels?: Maybe<Array<DocLabelObject>>;
  docLabelsString?: Maybe<Scalars['String']>;
  documentId?: Maybe<Scalars['ID']>;
  id: Scalars['Int'];
  metadata?: Maybe<Array<CellMetadata>>;
  nerLabels: Array<TextLabel>;
  posLabels: Array<TextLabel>;
  sentenceConflict?: Maybe<SentenceConflict>;
  status: TextSentenceStatus;
  tokens: Array<Scalars['String']>;
  userId?: Maybe<Scalars['ID']>;
};

export type TextSentenceInput = {
  content: Scalars['String'];
  docLabels?: InputMaybe<Array<DocLabelObjectInput>>;
  docLabelsString?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  metadata?: InputMaybe<Array<CellMetadataInput>>;
  nerLabels?: InputMaybe<Array<TextLabelInput>>;
  posLabels?: InputMaybe<Array<TextLabelInput>>;
  tokens?: InputMaybe<Array<Scalars['String']>>;
};

export enum TextSentenceStatus {
  Deleted = 'DELETED',
  Displayed = 'DISPLAYED',
  Hidden = 'HIDDEN'
}

export type TimelineEvent = {
  __typename?: 'TimelineEvent';
  created: Scalars['String'];
  event: Scalars['String'];
  id: Scalars['ID'];
  targetProject?: Maybe<TimelineProject>;
  targetUser?: Maybe<User>;
  user?: Maybe<User>;
};

export type TimelineProject = {
  __typename?: 'TimelineProject';
  id: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
  name: Scalars['String'];
};

export type TimestampLabel = {
  __typename?: 'TimestampLabel';
  documentId: Scalars['ID'];
  endTimestampMillis: Scalars['Int'];
  id: Scalars['ID'];
  layer: Scalars['Int'];
  position: TextRange;
  startTimestampMillis: Scalars['Int'];
  type: LabelEntityType;
};

export type TimestampLabelInput = {
  counter: Scalars['Int'];
  endTimestampMillis: Scalars['Int'];
  labeledBy?: InputMaybe<LabelPhase>;
  layer: Scalars['Int'];
  position: TextRangeInput;
  startTimestampMillis: Scalars['Int'];
};

export enum TokenizationMethod {
  WhiteSpace = 'WHITE_SPACE',
  Wink = 'WINK'
}

export type TrainingJob = {
  __typename?: 'TrainingJob';
  kind: DatasetKind;
  mlModelSettingId: Scalars['ID'];
  teamId: Scalars['ID'];
  version: Scalars['Int'];
};

export enum TranscriptMethod {
  CustomApi = 'CUSTOM_API',
  Internal = 'INTERNAL',
  Transcription = 'TRANSCRIPTION'
}

export type UnusedLabelSetItemInfo = {
  __typename?: 'UnusedLabelSetItemInfo';
  items: Array<TagItem>;
  labelSetId: Scalars['ID'];
  labelSetName: Scalars['String'];
};

export type UpdateConflictsInput = {
  ref: Scalars['String'];
  resolved: Scalars['Boolean'];
};

export type UpdateConflictsResult = {
  __typename?: 'UpdateConflictsResult';
  document: TextDocument;
  previousSentences: Array<TextSentence>;
  updatedSentences: Array<TextSentence>;
};

export type UpdateCustomApiInput = {
  endpointURL: Scalars['String'];
  name: Scalars['String'];
  secret?: InputMaybe<Scalars['String']>;
};

export type UpdateDatasetInput = {
  cabinets?: InputMaybe<Array<CabinetDocumentIdsInput>>;
  id: Scalars['ID'];
  kind: DatasetKind;
  labelCount: Scalars['Int'];
  mlModelSettingId: Scalars['ID'];
  teamId: Scalars['ID'];
};

export type UpdateDocumentAnswersResult = {
  __typename?: 'UpdateDocumentAnswersResult';
  previousAnswers: DocumentAnswer;
};

export type UpdateDocumentMetasInput = {
  documentMeta: Array<DocumentMetaInput>;
  projectId: Scalars['ID'];
};

export type UpdateExtensionElementInput = {
  height?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  order?: InputMaybe<Scalars['Int']>;
};

export type UpdateFileTransformerInput = {
  content?: InputMaybe<Scalars['String']>;
  fileTransformerId: Scalars['ID'];
  language?: InputMaybe<FileTransformerLanguage>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateLabelSetSettingsInput = {
  /** Required. The labelset ID. */
  id: Scalars['ID'];
  /**
   * Required. The labelset's zero-based index in a project.
   * Each project can have up to 5 labelset.
   */
  index: Scalars['Int'];
};

export type UpdateLabelSetTemplateInput = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  questions?: InputMaybe<Array<LabelSetTemplateItemInput>>;
};

export type UpdateLabelingFunctionInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  content?: InputMaybe<Scalars['String']>;
  labelingFunctionId: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateLabelsResult = {
  __typename?: 'UpdateLabelsResult';
  document: TextDocument;
  previousTokenLabels: Array<TextLabel>;
  rejectedLabels: Array<RejectedLabel>;
  updatedCellLines: Array<Scalars['Int']>;
  updatedSentences: Array<TextSentence>;
  updatedTokenLabels: Array<TextLabel>;
};

export type UpdateMultiRowAnswersInput = {
  labeledBy?: InputMaybe<ConflictTextLabelResolutionStrategy>;
  rowAnswers: Array<RowAnswersInput>;
  textDocumentId: Scalars['String'];
};

export type UpdateMultiRowAnswersResult = {
  __typename?: 'UpdateMultiRowAnswersResult';
  document: TextDocument;
  previousAnswers: Array<RowAnswer>;
  updatedAnswers: Array<RowAnswer>;
  updatedLabels: Array<TextLabel>;
};

export type UpdateProjectExtensionElementSettingInput = {
  id: Scalars['ID'];
  setting: ExtensionElementSettingInput;
};

export type UpdateProjectExtensionInput = {
  cabinetId: Scalars['String'];
  elements?: InputMaybe<Array<UpdateExtensionElementInput>>;
  width?: InputMaybe<Scalars['Int']>;
};

export type UpdateProjectGuidelineInput = {
  guidelineId: Scalars['ID'];
  projectId: Scalars['ID'];
};

export type UpdateProjectInput = {
  name?: InputMaybe<Scalars['String']>;
  projectId: Scalars['ID'];
  tagIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type UpdateProjectLabelSetByLabelSetTemplateInput = {
  /** Required. The labelset index to update. Accepts values from `0` to `4`. */
  index: Scalars['Int'];
  /** Required. The labelset to be used in the project. */
  labelSetTemplateId: Scalars['ID'];
  /** Required. The project to be updated. */
  projectId: Scalars['ID'];
};

export type UpdateProjectLabelSetInput = {
  /** Optional. Defaults to false. */
  arrowLabelRequired?: InputMaybe<Scalars['Boolean']>;
  /** Required. The labelset id to modify. */
  id: Scalars['ID'];
  /** Optional. The labelset signature to modify. */
  labelSetSignature?: InputMaybe<Scalars['String']>;
  /** Optional. New value for the labelset name. If not supplied, the labelset's name is not changed. */
  name?: InputMaybe<Scalars['String']>;
  /** Required. The project where the labelset is used. */
  projectId: Scalars['ID'];
  /** Optional. New items to replace the labelset items. If not supplied, the items are not replaced. */
  tagItems?: InputMaybe<Array<TagItemInput>>;
};

export type UpdateProjectSettingsInput = {
  autoMarkDocumentAsComplete?: InputMaybe<Scalars['Boolean']>;
  conflictResolution?: InputMaybe<ConflictResolutionInput>;
  dynamicReviewMemberId?: InputMaybe<Scalars['ID']>;
  dynamicReviewMethod?: InputMaybe<ProjectDynamicReviewMethod>;
  enableDeleteSentence?: InputMaybe<Scalars['Boolean']>;
  enableEditLabelSet?: InputMaybe<Scalars['Boolean']>;
  enableEditSentence?: InputMaybe<Scalars['Boolean']>;
  enableInsertSentence?: InputMaybe<Scalars['Boolean']>;
  hideLabelerNamesDuringReview?: InputMaybe<Scalars['Boolean']>;
  hideLabelsFromInactiveLabelSetDuringReview?: InputMaybe<Scalars['Boolean']>;
  hideOriginalSentencesDuringReview?: InputMaybe<Scalars['Boolean']>;
  hideRejectedLabelsDuringReview?: InputMaybe<Scalars['Boolean']>;
  projectId: Scalars['ID'];
  shouldConfirmUnusedLabelSetItems?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateProjectTemplateInput = {
  id: Scalars['ID'];
  logo?: InputMaybe<Scalars['Upload']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateQuestionSetInput = {
  id: Scalars['ID'];
  items?: InputMaybe<Array<QuestionSetItemInput>>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateReviewDocumentMetasInput = {
  documentMeta: Array<DocumentMetaInput>;
  projectId: Scalars['ID'];
};

export type UpdateRowAnswersResult = {
  __typename?: 'UpdateRowAnswersResult';
  document: TextDocument;
  previousAnswers: RowAnswer;
  updatedAnswers: RowAnswer;
};

export type UpdateSentenceConflictResult = {
  __typename?: 'UpdateSentenceConflictResult';
  addedLabels: Array<GqlConflictable>;
  cell: Cell;
  deletedLabels: Array<GqlConflictable>;
  labels: Array<TextLabel>;
};

export type UpdateSentenceDocLabelsResult = {
  __typename?: 'UpdateSentenceDocLabelsResult';
  addedLabels: Array<GqlConflictable>;
  deletedLabels: Array<GqlConflictable>;
  document: TextDocument;
  previousSentences: Array<TextSentence>;
  updatedCellLines: Array<Scalars['Int']>;
  updatedSentences: Array<TextSentence>;
};

export type UpdateSentenceResult = {
  __typename?: 'UpdateSentenceResult';
  addedBoundingBoxLabels: Array<BoundingBoxLabel>;
  addedLabels: Array<GqlConflictable>;
  deletedBoundingBoxLabels: Array<BoundingBoxLabel>;
  deletedLabels: Array<GqlConflictable>;
  document: TextDocument;
  /** @deprecated Use `addedLabels` and `deletedLabels` */
  previousTokenLabels: Array<TextLabel>;
  updatedCells: Array<Cell>;
  /** @deprecated Use `updatedCells` */
  updatedSentences: Array<TextSentence>;
  /** @deprecated Use `addedLabels` and `deletedLabels` */
  updatedTokenLabels: Array<TextLabel>;
};

export type UpdateTagInput = {
  name: Scalars['String'];
  tagId: Scalars['ID'];
  teamId?: InputMaybe<Scalars['ID']>;
};

export type UpdateTeamInput = {
  id: Scalars['ID'];
  logo?: InputMaybe<Scalars['Upload']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateTeamMemberTeamRoleInput = {
  teamMemberId: Scalars['ID'];
  teamRoleId?: InputMaybe<Scalars['ID']>;
};

export type UpdateTeamSettingInput = {
  allowedLabelerExportMethods?: InputMaybe<Array<GqlExportMethod>>;
  allowedReviewerExportMethods?: InputMaybe<Array<GqlExportMethod>>;
  defaultExternalObjectStorageId?: InputMaybe<Scalars['ID']>;
  enableAssistedLabeling?: InputMaybe<Scalars['Boolean']>;
  enableDataProgramming?: InputMaybe<Scalars['Boolean']>;
  enableWipeData?: InputMaybe<Scalars['Boolean']>;
  teamId: Scalars['ID'];
};

export type UpdateTextDocumentInput = {
  chunks?: InputMaybe<Array<TextChunkInput>>;
  currentSentenceCursor?: InputMaybe<Scalars['Int']>;
  fileName?: InputMaybe<Scalars['String']>;
  /** Required. The document ID to be updated. See `getCabinet` */
  id: Scalars['ID'];
  isCompleted?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  /** Optional. The updated settings value for the document. */
  settings?: InputMaybe<SettingsInput>;
  statistic?: InputMaybe<TextDocumentStatisticInput>;
  touchedSentences?: InputMaybe<Array<Scalars['Int']>>;
  type?: InputMaybe<TextDocumentType>;
  workspaceState?: InputMaybe<WorkspaceStateInput>;
};

export type UpdateTextDocumentLabelsInput = {
  index: Scalars['Int'];
  labelIds: Array<Scalars['String']>;
};

/** Configuration parameter for updating documents. */
export type UpdateTextDocumentSettingsInput = {
  /** Forces every token to have at least one label in Token Based Labeling. */
  allTokensMustBeLabeled?: InputMaybe<Scalars['Boolean']>;
  /** Allow arrows to be drawn between labels in Token Based Labeling. */
  allowArcDrawing?: InputMaybe<Scalars['Boolean']>;
  /** Enables character span labeling. */
  allowCharacterBasedLabeling?: InputMaybe<Scalars['Boolean']>;
  /** Enables placing multiple labels on one character / token span. */
  allowMultiLabels?: InputMaybe<Scalars['Boolean']>;
  autoScrollWhenLabeling?: InputMaybe<Scalars['Boolean']>;
  kind?: InputMaybe<ProjectKind>;
  lang?: InputMaybe<Scalars['String']>;
  projectId: Scalars['ID'];
  /**
   * Possible values are `
   * ` and `.`
   */
  sentenceSeparator?: InputMaybe<Scalars['String']>;
  /** Determines how many token that can be covered by one label. */
  textLabelMaxTokenLength?: InputMaybe<Scalars['Int']>;
};

export enum UpdateTokenLabelsAction {
  Label = 'LABEL',
  Undo = 'UNDO'
}

export type UpdateTokenLabelsInput = {
  action: UpdateTokenLabelsAction;
  documentId: Scalars['ID'];
  labels: Array<TextLabelInput>;
  signature: Scalars['String'];
  type?: InputMaybe<UpdateTokenLabelsInputType>;
};

export enum UpdateTokenLabelsInputType {
  Autolabel = 'AUTOLABEL',
  SearchLabelAll = 'SEARCH_LABEL_ALL'
}

export type UpsertOauthClientResult = {
  __typename?: 'UpsertOauthClientResult';
  id: Scalars['String'];
  secret: Scalars['String'];
};

export type Usage = {
  __typename?: 'Usage';
  end: Scalars['String'];
  labels: Scalars['Int'];
  start: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  allowedActions?: Maybe<Array<Action>>;
  displayName: Scalars['String'];
  email: Scalars['String'];
  emailVerified?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  package: Package;
  profilePicture?: Maybe<Scalars['String']>;
  teamPackage?: Maybe<Package>;
  username?: Maybe<Scalars['String']>;
};

export enum Visualization {
  AreaChart = 'AREA_CHART',
  BarChart = 'BAR_CHART',
  ColumnChart = 'COLUMN_CHART',
  PieChart = 'PIE_CHART',
  SteppedAreaChart = 'STEPPED_AREA_CHART',
  TableChart = 'TABLE_CHART'
}

export type VisualizationParams = {
  __typename?: 'VisualizationParams';
  abbreviateKey?: Maybe<Scalars['Boolean']>;
  chartArea?: Maybe<ChartArea>;
  colorGradient?: Maybe<ColorGradient>;
  colors?: Maybe<Array<Scalars['String']>>;
  hAxisTitle?: Maybe<Scalars['String']>;
  isStacked?: Maybe<Scalars['Boolean']>;
  itemsPerPage?: Maybe<Scalars['Int']>;
  legend?: Maybe<Legend>;
  pieHoleText?: Maybe<Scalars['String']>;
  showTable?: Maybe<Scalars['Boolean']>;
  vAxisTitle?: Maybe<Scalars['String']>;
  visualization: Visualization;
};

export type WaveformPeaks = {
  __typename?: 'WaveformPeaks';
  /** Generated audiowaveform data in Float. The peaks value is normalized ranging from 0 - 1. 1 denotes the max value (the loudest point in the audio input) */
  peaks: Array<Scalars['Float']>;
  /** The number of output waveform data points to generate for each second of audio input */
  pixelPerSecond: Scalars['Int'];
};

export type WelcomeEmail = {
  __typename?: 'WelcomeEmail';
  email: Scalars['String'];
};

export type WelcomeEmailInput = {
  email: Scalars['String'];
};

export type WipeProjectInput = {
  projectId: Scalars['ID'];
};

export type WorkspaceSettings = {
  __typename?: 'WorkspaceSettings';
  allTokensMustBeLabeled: Scalars['Boolean'];
  allowArcDrawing: Scalars['Boolean'];
  allowCharacterBasedLabeling?: Maybe<Scalars['Boolean']>;
  allowMultiLabels: Scalars['Boolean'];
  anonymizationEntityTypes?: Maybe<Array<Scalars['String']>>;
  anonymizationMaskingMethod?: Maybe<Scalars['String']>;
  anonymizationRegExps?: Maybe<Array<RegularExpression>>;
  autoScrollWhenLabeling: Scalars['Boolean'];
  /**
   * Deprecated. Please use field `fileTransformerId` instead.
   * @deprecated No longer supported
   */
  customScriptId?: Maybe<Scalars['ID']>;
  customTextExtractionAPIId?: Maybe<Scalars['ID']>;
  displayedRows: Scalars['Int'];
  enableAnonymization: Scalars['Boolean'];
  enableTabularMarkdownParsing?: Maybe<Scalars['Boolean']>;
  fileTransformerId?: Maybe<Scalars['ID']>;
  firstRowAsHeader?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  kinds: Array<ProjectKind>;
  mediaDisplayStrategy: MediaDisplayStrategy;
  ocrProvider?: Maybe<OcrProvider>;
  sentenceSeparator: Scalars['String'];
  textLabelMaxTokenLength: Scalars['Int'];
  tokenizer: Scalars['String'];
  transcriptMethod?: Maybe<TranscriptMethod>;
};

export type WorkspaceState = {
  __typename?: 'WorkspaceState';
  chunkId: Scalars['Int'];
  id: Scalars['ID'];
  sentenceEnd: Scalars['Int'];
  sentenceStart: Scalars['Int'];
  touchedChunks?: Maybe<Array<Scalars['Int']>>;
  touchedSentences?: Maybe<Array<Scalars['Int']>>;
};

export type WorkspaceStateInput = {
  chunkId: Scalars['Int'];
  sentenceEnd: Scalars['Int'];
  sentenceStart: Scalars['Int'];
};
