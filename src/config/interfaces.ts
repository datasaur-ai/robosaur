import { LabelItem } from '../datasaur/interfaces';

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
  documents: {
    /**
     * @description determine whether the source of the documents should be in local folder or remote url.
     */
    source: StorageSources;
    /**
     * @description Required for 'local' and 'remote' sources.
     * if the source is 'local', the path should point to a folder.
     * if the source is `remote`, the path should point to a JSON file. See the sample at config/documents.json
     */
    path: string;

    /**
     * @description Required for 'gcs' and 's3' sources.
     * the GCS or S3 bucket name, without gs:// or s3:// prefix
     */
    bucketName: string;

    /**
     * @description Required for 'gcs' and 's3' sources.
     * Path to the folder containing sub-folders, without leading slash (/). Each subfolders will be created as a new Datasaur project.
     * If the subfolders are located in root, set prefix to empty string ''
     */
    prefix: string;

    /**
     * @description Required for 'gcs' sources.
     * Relative or absolute local file path to the credential file.
     */
    gcsCredentialJson: string;

    /**
     * @description Required for 's3' sources.
     */
    s3Endpoint: string;

    /**
     * @description Required for 's3' sources.
     */
    s3Port: number;

    /**
     * @description Required for 's3' sources.
     */
    s3AccessKey: string;

    /**
     * @description Required for 's3' sources.
     */
    s3SecretKey: string;

    /**
     * @description Required for 's3' sources.
     */
    s3UseSSl: boolean;

    /**
     * @description For 'gcs' and 's3' sources
     * Path to a state file to keep-track which folders and projects have been created.
     * If not supplied, script will always create a new project for each and every folder
     */
    stateFilePath: string;
  };
  assignment: {
    /**
     * @description determine whether the source of the assignment file should be in local folder or remote url.
     */
    source: StorageSources.LOCAL | StorageSources.AMAZONS3 | StorageSources.GOOGLE;
    /**
     * @description path to file, or path to file in storage bucket
     */
    path: string;
  };

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
        options: Array<LabelItem>;
      };
    }>;

    /**
     * @description Optional. Local path to a folder containing CSV files for TOKEN_BASED
     */
    labelSetDirectory?: string;
  };
}
