import { Config } from '../../../config/interfaces';
import { ConflictResolutionMode, ProjectSettingsInput } from '../../../generated/graphql';
import { ProjectSettingsInputWithConsensus } from '../interfaces';
import { mapProjectSettings } from './project-settings.mapper';

describe('projectSettingsMapper', () => {
  it('should map projectSettings from PCW to robosaur config', () => {
    const fromPcw: ProjectSettingsInput = {
      enableEditLabelSet: true,
      enableEditSentence: true,
      hideLabelerNamesDuringReview: false,
      hideLabelsFromInactiveLabelSetDuringReview: false,
      hideOriginalSentencesDuringReview: true,
      hideRejectedLabelsDuringReview: true,
      conflictResolution: { consensus: 1, mode: ConflictResolutionMode.Manual },
    };

    const mapped: Config['create']['projectSettings'] = {
      enableEditLabelSet: true,
      enableEditSentence: true,
      hideLabelerNamesDuringReview: false,
      hideLabelsFromInactiveLabelSetDuringReview: false,
      hideRejectedLabelsDuringReview: true,
      conflictResolution: { consensus: 1, mode: ConflictResolutionMode.Manual },
    };

    const result = mapProjectSettings.fromPcw(fromPcw);

    expect(result).toEqual(mapped);
  });

  it('should use previous version projectSettings for older version of Datasaur', () => {
    const fromPreviousVersionOfPcw: ProjectSettingsInputWithConsensus = {
      enableEditLabelSet: true,
      enableEditSentence: true,
      hideLabelerNamesDuringReview: false,
      hideLabelsFromInactiveLabelSetDuringReview: false,
      hideOriginalSentencesDuringReview: true,
      hideRejectedLabelsDuringReview: true,
      consensus: 3,
    };

    const mapped: Config['create']['projectSettings'] = {
      enableEditLabelSet: true,
      enableEditSentence: true,
      hideLabelerNamesDuringReview: false,
      hideLabelsFromInactiveLabelSetDuringReview: false,
      hideRejectedLabelsDuringReview: true,
      consensus: 3,
    };

    const result = mapProjectSettings.fromPcwWithConsensus(fromPreviousVersionOfPcw);

    expect(result).toEqual(mapped);
  });
});
