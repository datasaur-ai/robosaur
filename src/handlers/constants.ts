import { DocumentAssignment } from '../assignment/interfaces';
import { Config } from '../config/interfaces';
import { LocalDocument, RemoteDocument } from '../documents/interfaces';

export interface ProjectConfiguration {
  projectName: string;
  documents: Array<RemoteDocument | LocalDocument>;
  documentAssignments: Array<DocumentAssignment>;

  /**
   * @description taken from getConfig().project
   */
  projectConfig: Config['create'];
}

export const PROJECT_CREATION_CONFIG = {
  LIMIT_RETRY: 3,
  PROJECT_BEFORE_SAVE: 5,
};

export const enum ScriptAction {
  PROJECT_CREATION = 'CREATION',
  PROJECT_EXPORT = 'EXPORT',
  EXPORT_ANNOTATED_DATA = 'EXPORT_ANNOTATED_DATA',
  APPLY_TAGS = 'APPLY_TAGS',
  SPLIT_DOCUMENT = 'SPLIT_DOCUMENT',
  NONE = 'NONE',
}
