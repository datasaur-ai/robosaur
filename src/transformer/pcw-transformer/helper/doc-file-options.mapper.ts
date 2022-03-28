import { Config } from '../../../config/interfaces';
import { DocFileOptionsInput } from '../../../generated/graphql';
import { removeNulls } from './removeNull';

export const docFileOptionsMapper = {
  fromPcw: (payload: DocFileOptionsInput): Config['project']['docFileOptions'] => ({
    firstRowAsHeader: removeNulls(payload.firstRowAsHeader),
    customHeaderColumns: removeNulls(payload.customHeaderColumns),
  }),
};
