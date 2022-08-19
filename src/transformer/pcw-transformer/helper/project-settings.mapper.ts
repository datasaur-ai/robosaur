import { Config } from '../../../config/interfaces';
import { ConflictResolutionMode } from '../../../generated/graphql';
import { DatasaurVersion } from '../constants';
import { ProjectSettingsInputWithConsensus, PCWPayload } from '../interfaces';
import { removeNulls } from './removeNull';

export type ConfigProjectSettings = Config['create']['projectSettings'];

export const mapProjectSettings = {
  fromPcw: (payload: ProjectSettingsInputWithConsensus): ConfigProjectSettings => ({
    conflictResolution: {
      mode: removeNulls(payload.conflictResolution?.mode ?? ConflictResolutionMode.PeerReview),
      consensus: removeNulls(payload.conflictResolution?.consensus ?? payload.consensus ?? 1),
    },
    enableEditLabelSet: removeNulls(payload.enableEditLabelSet),
    enableEditSentence: removeNulls(payload.enableEditSentence),
    hideLabelerNamesDuringReview: removeNulls(payload.hideLabelerNamesDuringReview),
    hideRejectedLabelsDuringReview: removeNulls(payload.hideRejectedLabelsDuringReview),
    hideLabelsFromInactiveLabelSetDuringReview: removeNulls(payload.hideLabelsFromInactiveLabelSetDuringReview),
  }),
  fromPcwWithConsensus: (payload: ProjectSettingsInputWithConsensus): ConfigProjectSettings => ({
    consensus: removeNulls(payload.consensus ?? payload.conflictResolution?.consensus ?? 1),
    enableEditLabelSet: removeNulls(payload.enableEditLabelSet),
    enableEditSentence: removeNulls(payload.enableEditSentence),
    hideLabelerNamesDuringReview: removeNulls(payload.hideLabelerNamesDuringReview),
    hideRejectedLabelsDuringReview: removeNulls(payload.hideRejectedLabelsDuringReview),
    hideLabelsFromInactiveLabelSetDuringReview: removeNulls(payload.hideLabelsFromInactiveLabelSetDuringReview),
  }),
};

export const DatasaurVersionMapper = new Map<DatasaurVersion, (payload: PCWPayload) => ConfigProjectSettings>();
DatasaurVersionMapper.set(DatasaurVersion.LATEST, (payload) => {
  const projectSettingsPayload = payload.projectSettings;
  return mapProjectSettings.fromPcw(projectSettingsPayload);
});
DatasaurVersionMapper.set(DatasaurVersion.v5_37_0, (payload) => {
  const projectSettingsPayload = payload.projectSettings;
  return mapProjectSettings.fromPcwWithConsensus(projectSettingsPayload);
});
