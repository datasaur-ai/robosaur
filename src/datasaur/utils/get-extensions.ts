import { ExtensionID, EXTENSIONS } from '../constants';

export const getExtensions = (kinds: string[]) => {
  let LABELER: ExtensionID[] = [];
  let REVIEWER: ExtensionID[] = [];
  kinds.forEach((kind) => {
    LABELER = [...new Set([...LABELER, ...EXTENSIONS[kind].LABELER])];
    REVIEWER = [...new Set([...REVIEWER, ...EXTENSIONS[kind].REVIEWER])];
  });
  return {
    LABELER,
    REVIEWER,
  };
};
