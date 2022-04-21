import { FilesConfig } from '../../config/interfaces';
import {
  CreateTextDocumentInput,
  DocumentAssignmentInput,
  ExtensionId,
  LabelSetTextProjectInput,
  ProjectAssignmentByNameInput,
  ProjectPurpose,
  ProjectSettingsInput,
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
   * @description Required if --use-pcw is used
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
  projectSettings: ProjectSettingsInput;
  documentSettings: TextDocumentSettingsInput;
  documents?: CreateTextDocumentInput[];
  tagNames?: string[];
  purpose?: ProjectPurpose;
  labelerExtensions?: ExtensionId[];
  reviewerExtensions?: ExtensionId[];
  splitDocumentOption?: SplitDocumentOptionInput;
  teamId: string;
}
