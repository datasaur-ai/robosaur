import { ExportFormat, ProjectStatus } from '../datasaur/interfaces';
import { PCWPayload, PCWWrapper } from '../transformer/pcw-transformer/interfaces';
import { AssignmentConfig as ParsedAssignment } from '../assignment/interfaces';
import { ConflictResolutionMode, TextDocumentType, TokenizationMethod, TranscriptMethod } from '../generated/graphql';

export enum StorageSources {
  AMAZONS3 = 's3',
  AZURE = 'azure',
  GOOGLE = 'gcs',
  INLINE = 'inline',
  LOCAL = 'local',
  REMOTE = 'remote',
}

export enum SplitDocumentStrategy {
  /**
   * @description Split each document into n equal parts, based on the `number` value
   */
  BY_PARTS = 'BY_PARTS',
  DONT_SPLIT = 'DONT_SPLIT',
}

export enum StateConfig {
  STATEFUL = 'stateful',
  STATELESS = 'stateless',
}

export interface Config {
  datasaur: {
    /**
     * @description Target environment of Datasaur. To target our cloud environment, set to https://app.datasaur.ai
     */
    host: string;
    /**
     * @description Obtain the client ID and Secret in this [guide](https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/oauth-2.0)
     */
    clientId: string;
    /**
     * @description Obtain the client ID and Secret in this [guide](https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/oauth-2.0)
     */
    clientSecret: string;
  };

  credentials: CredentialsConfig;
  projectState: StatefileConfig;

  // project export
  export: ExportConfig;

  // export annotated data
  exportAnnotatedData: ExportAnnotatedDataConfig;

  // project creation
  create: CreateConfig;

  // apply tags to project
  applyTags: ApplyTagsConfig;

  // split document
  splitDocument: SplitDocumentConfig;
}

export interface CreateConfig {
  /**
   * @description id of the team.
   * The ID can be obtained from your team workspace page in this format: https://app.datasaur.ai/teams/{teamId}
   */
  teamId: string;

  files: FilesConfig;
  assignment?: AssignmentConfig;

  /**
   * @description Not required if --without-pcw is used
   * Source to get the PCW Payload
   */
  pcwPayloadSource?: PCWSource;

  /**
   * @description Not required if --without-pcw is used
   * local or remote path to assignment file if pcwPayloadSource is StorageSource
   * PCWPayload if pcwPayloadSource is INLINE
   */
  pcwPayload?: string | (PCWWrapper & PCWPayload);

  /**
   * @description Not required if --without-pcw is used
   * local or remote path to assignment file if pcwPayloadSource is StorageSource
   * PCWPayload if pcwPayloadSource is INLINE
   */
  pcwAssignmentStrategy?: 'ALL' | 'AUTO';

  /**
   * @description Used to store parsed assignments
   */
  assignments?: ParsedAssignment;

  /**
   * Configuration from the 4th and 5th step of the Creation Wizard UI.
   */
  projectSettings: {
    /**
     * @deprecated Moved to conflictResolution.consensus
     */
    consensus?: number;
    conflictResolution?: {
      consensus: number;
      mode: ConflictResolutionMode;
    };
    enableEditLabelSet: boolean;
    enableEditSentence: boolean;
    hideLabelerNamesDuringReview: boolean;
    hideRejectedLabelsDuringReview: boolean;
    hideLabelsFromInactiveLabelSetDuringReview: boolean;
  };
  /**
   * @description Configuration from the 2nd and 3rd step of the Creation Wizard UI
   */
  documentSettings: {
    /**
     * @description determine the task type of the project. Can be TOKEN_BASED or ROW_BASED or DOCUMENT_BASED
     */
    kind?: string;
    /**
     * @description determine the file transformer to be used.
     * The ID can be obtained from the file transformer page in this format: https://app.datasaur.ai/teams/{teamId}/file-transformers/{file-transformer-id}
     */
    fileTransformerId?: string;

    // TOKEN_BASED
    allTokensMustBeLabeled?: boolean;
    allowArcDrawing?: boolean;
    allowMultiLabels?: boolean;
    textLabelMaxTokenLength?: number;
    allowCharacterBasedLabeling?: boolean;

    // ROW_BASED or DOCUMENT_BASED
    displayedRows?: number;
    mediaDisplayStrategy?: string;
    firstRowAsHeader?: boolean;
    viewer?: string;
    viewerConfig?: {
      urlColumnNames: string[];
    };
    enableTabularMarkdownParsing: boolean;

    /**
     * @description Audio project configuration
     */
    transcriptMethod?: TranscriptMethod;
    tokenizer?: TokenizationMethod;

    autoScrollWhenLabeling?: boolean;
    sentenceSeparator?: string;

    enableAnonymization?: boolean;

    anonymizationEntityTypes?: Array<string>;
    anonymizationMaskingMethod?: string;
    anonymizationRegExps?: Array<string>;
  };
  type?: TextDocumentType;
  kinds?: string[];
  /**
   * @description Question configurations. Only applicable when documentSettings.kind is ROW_BASED or DOCUMENT_BASED
   */
  questions?: any[];
  /**
   * @description Optional. Local path to a JSON file containing list of questions. For information on structure, please refer to: https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/create-new-project/questions
   */
  questionSetFile?: string;
  /**
   * @description Label sets configurations. Only applicable when documentSettings.kind is TOKEN_BASED
   */
  labelSets?: Array<null | {
    label: string;
    config: {
      options: Array<{
        id: string;
        parentId?: string | null;
        label: string;
        color?: string | null;
      }>;
    };
  }>;
  /**
   * @description Optional. Local path to a folder containing CSV files for TOKEN_BASED. If both labelSetDirectory and labelSets is provided, robosaur will pick labelSets
   */
  labelSetDirectory?: string;
  /**
   * @description Optional. Configuration for ROW_BASED projects.
   */
  docFileOptions?: {
    firstRowAsHeader?: boolean;
    /**
     * @description Array of column header
     */
    customHeaderColumns?: Array<{
      /**
       * @description true: Display column to all; false: Hide column to all. REVIEWER can change it in their workspace
       */
      displayed: boolean;
      /**
       * @description true: Hidden from LABELER, cannot be changed by LABELER.
       */
      labelerRestricted: boolean;
      /**
       * @description Column text
       */
      name: string;
    }>;
  };

  /**
   * @description Optional. Configuration for splitting documents in a project
   */
  splitDocumentOption?: {
    strategy: SplitDocumentStrategy;
    number: number;
  };
}

export interface CredentialsConfig {
  [StorageSources.AMAZONS3]: {
    s3Endpoint: string;
    s3Port: number;
    s3AccessKey: string;
    s3SecretKey: string;
    s3UseSSL: boolean;
    s3Region: string;
  };
  [StorageSources.GOOGLE]: {
    /**
     * @description Relative or absolute local file path to the credential file.
     */
    gcsCredentialJson: string;
  };
  [StorageSources.AZURE]: {
    /**
     * @description Connection string from Azure Storage Account.
     */
    connectionString: string;
    /**
     * @description Name of the container for the projects, scripts, and exported files.
     */
    containerName: string;
  };
}

export interface StatefileConfig extends WithStorage {
  /**
   * @description For 'gcs' and 's3' sources
   * Path to a state file to keep-track which folders and projects have been created and exported.
   */
  path: string;
}

export interface FilesConfig extends WithStorage {
  /**
   * @description Required for 'gcs' and 's3' sources.
   * Path to the folder containing sub-folders, without leading slash (/)
   * Each subfolders will be created as a new Datasaur project
   * If the subfolders are located in root, set prefix to empty string ''
   */
  prefix: string;
  /**
   * @description Required for 'local' and 'remote' sources.
   * if the source is 'local', the path should point to a folder
   * if the source is `remote`, the path should point to a JSON file. See the sample at config/remote-files/documents.json
   */
  path: string;
}

export interface PCWSource extends WithStorage {
  source:
    | StorageSources.AMAZONS3
    | StorageSources.GOOGLE
    | StorageSources.LOCAL
    | StorageSources.INLINE
    | StorageSources.AZURE;
}

export interface AssignmentConfig extends WithStorage {
  source: StorageSources.AMAZONS3 | StorageSources.GOOGLE | StorageSources.LOCAL | StorageSources.AZURE;
  /**
   * @description local or remote path to assignment file
   */
  path: string;
  by: 'PROJECT' | 'DOCUMENT';

  /**
   * @description document assignment strategy.
   * ALL -> all documents will be assigned to all labelers
   * AUTO -> round-robin assignment for labelers
   */
  strategy: 'ALL' | 'AUTO';
}

export interface ExportConfig extends WithStorage {
  /**
   * @description Projects' status to filter.
   * Only projects matching the specified statuses will be exported by Robosaur.
   * The possible statuses, in order are:
   * CREATED, IN_PROGRESS, REVIEW_READY, IN_REVIEW, COMPLETE
   */
  statusFilter: Array<ProjectStatus>;

  /**
   * @description Specify what method the projects to be exported are created with.
   */
  executionMode?: StateConfig;

  /**
   * @description Required if executionMode is 'stateless'
   * A filter on which projects to export
   */
  projectFilter?: {
    kind: string;
    date?: {
      newestDate: Date;
      oldestDate?: Date;
    };
    tags?: string[];
  };

  /**
   * @description Required for 'gcs' and 's3' sources.
   * Path to the folder containing sub-folders, without leading slash (/)
   * Each exported project will be uploaded into a separate subfolder, with its' projectName as the folder name
   * If the subfolders are located in root, set prefix to empty string ''
   */
  prefix: string;

  /**
   * @description id of the team.
   * The ID can be obtained from your team workspace page in this format: https://app.datasaur.ai/teams/{teamId}
   */
  teamId: string;

  /**
   * @description format of the experted project
   * see [Datasaur GitBook](https://datasaurai.gitbook.io/datasaur/advanced/apis-docs/export-project#export-all-files) for more information
   */
  format: ExportFormat;

  /**
   * @description custom export script to use
   * only used when format is CUSTOM
   * The ID can be obtained from the file transformer page in this format: https://app.datasaur.ai/teams/{teamId}/file-transformers/{file-transformer-id}
   */
  fileTransformerId: string;
}

export interface ExportAnnotatedDataConfig extends WithStorage {
  /**
   * @description Projects' status to filter.
   * Only projects matching the specified statuses will be exported by Robosaur.
   * The possible statuses, in order are:
   * CREATED, IN_PROGRESS, REVIEW_READY, IN_REVIEW, COMPLETE
   */
  statusFilter: Array<ProjectStatus>;

  /**
   * @description A filter on which projects to export
   */
  projectFilter?: {
    date?: {
      newestDate: Date;
      oldestDate?: Date;
    };
    tags?: string[];
    keyword?: string;
  };

  /**
   * @description Required for 'gcs' and 's3' sources.
   * Path to the folder containing sub-folders, without leading slash (/)
   * Each exported project will be uploaded into a separate subfolder, with its' projectName as the folder name
   * If the subfolders are located in root, set prefix to empty string ''
   */
  prefix: string;

  /**
   * @description id of the team.
   * The ID can be obtained from your team workspace page in this format: https://app.datasaur.ai/teams/{teamId}
   */
  teamId: string;
}

export interface ApplyTagsConfig extends WithStorage {
  teamId: string;
  source:
    | StorageSources.AMAZONS3
    | StorageSources.GOOGLE
    | StorageSources.LOCAL
    | StorageSources.INLINE
    | StorageSources.AZURE;
  prefix: string;
  path: string;
  payload: ProjectTags[];
}

export interface ProjectTags {
  projectId: string;
  tags: Array<string>;
}

interface WithStorage {
  source: StorageSources;
  /**
   * @description Required for 'gcs' and 's3' sources.
   * the GCS or S3 bucket name, without gs:// or s3:// prefix
   */
  bucketName: string;
}

export interface SplitDocumentConfig {
  path: string;
  header: boolean;
  linesPerFile: number;
  filesPerFolder: number;
  resultFolder: string;
}
