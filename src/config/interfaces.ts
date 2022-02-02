import { ExportFormat, ProjectStatus } from '../datasaur/interfaces';

export enum StorageSources {
  LOCAL = 'local',
  REMOTE = 'remote',
  GOOGLE = 'gcs',
  AMAZONS3 = 's3',
}

export interface Config {
  datasaur: {
    /**
     * @description Target environment of Datasaur. To target our cloud environment, set to https://datasaur.ai
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

  // project creation
  documents: DocumentsConfig;
  assignment: AssignmentConfig;
  project: {
    /**
     * @description id of the team.
     * The ID can be obtained from your team workspace page in this format: https://datasaur.ai/teams/{teamId}
     */
    teamId: string;
    /**
     * Configuration from the 4th and 5th step of the Creation Wizard UI.
     */
    projectSettings: {
      consensus: number;
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
       * @description determine the task type of the project. Can be TOKEN_BASED or ROW_BASED
       */
      kind: string;
      /**
       * @description determine the custom script to be used.
       * The ID can be obtained from the custom script page in this format: https://datasaur.ai/teams/{teamId}/custom-scripts/{custom-script-id}
       */
      customScriptId?: string;

      // TOKEN_BASED
      allTokensMustBeLabeled?: boolean;
      allowArcDrawing?: boolean;
      allowMultiLabels?: boolean;
      textLabelMaxTokenLength?: number;
      allowCharacterBasedLabeling?: boolean;

      // ROW_BASED
      displayedRows?: number;
      mediaDisplayStrategy?: string;
      firstRowAsHeader?: boolean;
      viewer?: string;
      viewerConfig?: {
        urlColumnNames: string[];
      };
    };
    /**
     * @description Question configurations. Only applicable when documentSettings.kind is ROW_BASED
     */
    questions?: any[];
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
  };
}

export interface CredentialsConfig {
  [StorageSources.AMAZONS3]: {
    s3Endpoint: string;
    s3Port: number;
    s3AccessKey: string;
    s3SecretKey: string;
    s3UseSSL: boolean;
  };
  [StorageSources.GOOGLE]: {
    /**
     * @description Relative or absolute local file path to the credential file.
     */
    gcsCredentialJson: string;
  };
}

export interface StatefileConfig extends WithStorage {
  /**
   * @description For 'gcs' and 's3' sources
   * Path to a state file to keep-track which folders and projects have been created and exported.
   */
  path: string;
}

export interface DocumentsConfig extends WithStorage {
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

export interface AssignmentConfig extends WithStorage {
  source: StorageSources.AMAZONS3 | StorageSources.GOOGLE | StorageSources.LOCAL;
  /**
   * @description local or remote path to assignment file
   */
  path: string;
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
   * @description Required for 'gcs' and 's3' sources.
   * Path to the folder containing sub-folders, without leading slash (/)
   * Each exported project will be uploaded into a separate subfolder, with its' projectName as the folder name
   * If the subfolders are located in root, set prefix to empty string ''
   */
  prefix: string;

  /**
   * @description id of the team.
   * The ID can be obtained from your team workspace page in this format: https://datasaur.ai/teams/{teamId}
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
   * The ID can be obtained from the custom script page in this format: https://datasaur.ai/teams/{teamId}/custom-scripts/{custom-script-id}
   */
  customScriptId: string;
}

interface WithStorage {
  source: StorageSources;
  /**
   * @description Required for 'gcs' and 's3' sources.
   * the GCS or S3 bucket name, without gs:// or s3:// prefix
   */
  bucketName: string;
}
