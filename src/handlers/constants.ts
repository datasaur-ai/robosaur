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
  projectConfig: Config['project'];
}

export const PROJECT_CREATION_CONFIG = {
  LIMIT_RETRY: 3,
  PROJECT_BEFORE_SAVE: 5,
};

export const enum ScriptAction {
  PROJECT_CREATION = 'CREATION',
  PROJECT_EXPORT = 'EXPORT',
  NONE = 'NONE',
}
