import { Config } from '../../../config/interfaces';
import { ProjectSettingsInput } from '../../../generated/graphql';
import { ProjectSettingsInputWithConsensus } from '../interfaces';
import { removeNulls } from './removeNull';

export type ConfigProjectSettings = Config['create']['projectSettings'];

export const mapProjectSettings = {
  fromPcw: (payload: ProjectSettingsInput): ConfigProjectSettings => ({
    conflictResolution: {
      mode: removeNulls(payload.conflictResolution?.mode),
      consensus: removeNulls(payload.conflictResolution?.consensus),
    },
    enableEditLabelSet: removeNulls(payload.enableEditLabelSet),
    enableEditSentence: removeNulls(payload.enableEditSentence),
    hideLabelerNamesDuringReview: removeNulls(payload.hideLabelerNamesDuringReview),
    hideRejectedLabelsDuringReview: removeNulls(payload.hideRejectedLabelsDuringReview),
    hideLabelsFromInactiveLabelSetDuringReview: removeNulls(payload.hideLabelsFromInactiveLabelSetDuringReview),
  }),
  fromPcwWithConsensus: (payload: ProjectSettingsInputWithConsensus): ConfigProjectSettings => ({
    consensus: removeNulls(payload.consensus),
    enableEditLabelSet: removeNulls(payload.enableEditLabelSet),
    enableEditSentence: removeNulls(payload.enableEditSentence),
    hideLabelerNamesDuringReview: removeNulls(payload.hideLabelerNamesDuringReview),
    hideRejectedLabelsDuringReview: removeNulls(payload.hideRejectedLabelsDuringReview),
    hideLabelsFromInactiveLabelSetDuringReview: removeNulls(payload.hideLabelsFromInactiveLabelSetDuringReview),
  }),
};
