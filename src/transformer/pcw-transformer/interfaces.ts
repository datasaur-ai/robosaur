import { FilesConfig } from '../../config/interfaces';
import {
  CreateTextDocumentInput,
  DocumentAssignmentInput,
  ExtensionId,
  InputMaybe,
  LabelSetTextProjectInput,
  ProjectAssignmentByNameInput,
  ProjectDynamicReviewMethod,
  ProjectPurpose,
  ProjectSettingsInput,
  Scalars,
  SplitDocumentOptionInput,
  TextDocumentKind,
  TextDocumentSettingsInput,
  TextDocumentType,
} from '../../generated/graphql';

export interface PCWWrapper {
  operationName: string;
  variables: {
    input: PCWPayload;
  };
  query: string;

  /**
   * @description Not required if --without-pcw is used
   * local or remote path to assignment file if pcwPayloadSource is StorageSource
   * PCWPayload if pcwPayloadSource is INLINE
   */

  pcwAssignmentStrategy?: 'ALL' | 'AUTO';
  files: FilesConfig;
}

export interface PCWPayload {
  assignees?: ProjectAssignmentByNameInput[];
  documentAssignments?: DocumentAssignmentInput[];
  name: string;
  type?: TextDocumentType;
  kinds?: TextDocumentKind[];
  labelSets?: LabelSetTextProjectInput[];
  labelSetIDs?: string[];
  labelSetId?: string;
  guidelineId?: string;
  projectCreationId?: string;
  projectSettings: ProjectSettingsInput | ProjectSettingsInputWithConsensus;
  documentSettings: TextDocumentSettingsInput;
  documents?: CreateTextDocumentInput[];
  tagNames?: string[];
  purpose?: ProjectPurpose;
  labelerExtensions?: ExtensionId[];
  reviewerExtensions?: ExtensionId[];
  splitDocumentOption?: SplitDocumentOptionInput;
  teamId: string;
}

export type ProjectSettingsInputWithConsensus = {
  consensus?: InputMaybe<Scalars['Int']>;
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
};
