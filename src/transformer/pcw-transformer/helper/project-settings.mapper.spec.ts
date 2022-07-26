import { Config } from '../../../config/interfaces';
import { ConflictResolutionMode, ProjectSettingsInput } from '../../../generated/graphql';
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
});
