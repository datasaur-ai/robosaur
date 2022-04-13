import { Config } from '../../../config/interfaces';
import { ProjectSettingsInput } from '../../../generated/graphql';
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
      consensus: 1,
    };

    const mapped: Config['create']['projectSettings'] = {
      enableEditLabelSet: true,
      enableEditSentence: true,
      hideLabelerNamesDuringReview: false,
      hideLabelsFromInactiveLabelSetDuringReview: false,
      hideRejectedLabelsDuringReview: true,
      consensus: 1,
    };

    const result = mapProjectSettings.fromPcw(fromPcw);

    expect(result).toEqual(mapped);
  });
});
