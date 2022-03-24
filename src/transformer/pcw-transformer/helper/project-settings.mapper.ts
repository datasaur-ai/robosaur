import { Config } from '../../../config/interfaces';
import { ProjectSettingsInput } from '../../../generated/graphql';

export const projectSettingsMapper = {
  fromPcw: (payload: ProjectSettingsInput): Config['project']['projectSettings'] => ({
    consensus: payload.consensus!,
    enableEditLabelSet: payload.enableEditLabelSet!,
    enableEditSentence: payload.enableEditSentence!,
    hideLabelerNamesDuringReview: payload.hideLabelerNamesDuringReview!,
    hideRejectedLabelsDuringReview: payload.hideRejectedLabelsDuringReview!,
    hideLabelsFromInactiveLabelSetDuringReview: payload.hideLabelsFromInactiveLabelSetDuringReview!,
  }),
};
