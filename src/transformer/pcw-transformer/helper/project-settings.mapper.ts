import { Config } from '../../../config/interfaces';
import { ProjectSettingsInput } from '../../../generated/graphql';
import { removeNulls } from './removeNull';

export type ConfigProjectSettings = Config['project']['projectSettings'];

export const projectSettingsMapper = {
  fromPcw: (payload: ProjectSettingsInput): ConfigProjectSettings => ({
    consensus: removeNulls(payload.consensus),
    enableEditLabelSet: removeNulls(payload.enableEditLabelSet),
    enableEditSentence: removeNulls(payload.enableEditSentence),
    hideLabelerNamesDuringReview: removeNulls(payload.hideLabelerNamesDuringReview),
    hideRejectedLabelsDuringReview: removeNulls(payload.hideRejectedLabelsDuringReview),
    hideLabelsFromInactiveLabelSetDuringReview: removeNulls(payload.hideLabelsFromInactiveLabelSetDuringReview),
  }),
};
