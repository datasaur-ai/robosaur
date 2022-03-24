import { Config } from '../../../config/interfaces';
import { DocFileOptionsInput } from '../../../generated/graphql';

export const docFileOptionsMapper = {
  fromPcw: (payload: DocFileOptionsInput): Config['project']['docFileOptions'] => ({
    firstRowAsHeader: payload.firstRowAsHeader!,
    customHeaderColumns: payload.customHeaderColumns!,
  }),
};
