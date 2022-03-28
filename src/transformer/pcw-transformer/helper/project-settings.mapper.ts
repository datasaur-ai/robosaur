import { Config } from '../../../config/interfaces';
import { ProjectSettingsInput } from '../../../generated/graphql';
import { removeNulls } from './removeNull';

export const projectSettingsMapper = {
  fromPcw: (payload: ProjectSettingsInput): Config['project']['projectSettings'] => ({
    consensus: removeNulls(payload.consensus),
    enableEditLabelSet: removeNulls(payload.enableEditLabelSet),
    enableEditSentence: removeNulls(payload.enableEditSentence),
    hideLabelerNamesDuringReview: removeNulls(payload.hideLabelerNamesDuringReview),
    hideRejectedLabelsDuringReview: removeNulls(payload.hideRejectedLabelsDuringReview),
    hideLabelsFromInactiveLabelSetDuringReview: removeNulls(payload.hideLabelsFromInactiveLabelSetDuringReview),
  }),
};
