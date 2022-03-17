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
  projectSettings?: ProjectSettingsInput;
  documentSettings: TextDocumentSettingsInput;
  documents?: CreateTextDocumentInput[];
  tagNames?: string[];
  purpose?: ProjectPurpose;
  labelerExtensions?: ExtensionId[];
  reviewerExtensions?: ExtensionId[];
  splitDocumentOption?: SplitDocumentOptionInput;
}
