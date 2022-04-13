import { Config } from '../../../config/interfaces';
import { LabelSetTextProjectInput } from '../../../generated/graphql';

export type ConfigLabelSets = Config['create']['labelSets'];

export const mapLabelSet = {
  fromPcw: (payload: LabelSetTextProjectInput[]): ConfigLabelSets => {
    return payload.map((labelSet) => ({
      label: labelSet.name,
      config: {
        options: labelSet.options,
      },
    }));
  },
};
