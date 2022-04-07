import { Config } from '../../../config/interfaces';
import { LabelSetTextProjectInput } from '../../../generated/graphql';

export type ConfigLabelSets = Config['project']['labelSets'];

export const labelSetMapper = {
  fromPcw: (payload: LabelSetTextProjectInput[]): ConfigLabelSets => {
    return payload.map((labelSet) => ({
      label: labelSet.name,
      config: {
        options: labelSet.options,
      },
    }));
  },
};
