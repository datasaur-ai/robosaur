import { Config } from '../../../config/interfaces';
import { LabelSetTextProjectInput } from '../../../generated/graphql';

export const labelSetMapper = {
  fromPcw: (payload: LabelSetTextProjectInput[]): Config['project']['labelSets'] => {
    return payload.map((labelSet) => {
      return {
        label: labelSet.name,
        config: {
          options: labelSet.options,
        },
      };
    });
  },
};
