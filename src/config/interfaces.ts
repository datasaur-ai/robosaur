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
    source: 'local' | 'remote';
    /**
     * @description if the source is 'local', the path should point to a folder.
     * if the source is `remote`, the path should point to a JSON file. See the sample at config/documents.json
     */
    path: string;
  };
  assignment: {
    /**
     * @description describe labelers who will be assigned to the project
     */
    labelers: string[];
    /**
     * @description describe reviewers who will be assigned to the project
     */
    reviewers: string[];
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
        options: Array<{
          id: string;
          parentId?: string | null;
          label: string;
          color?: string | null;
        }>;
      }
    }>;  
  };
}