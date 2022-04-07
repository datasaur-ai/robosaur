import { Config } from '../../../config/interfaces';
import { DocFileOptionsInput } from '../../../generated/graphql';
import { removeNulls } from './removeNull';

export type ConfigDocFileOption = Config['project']['docFileOptions'];

export const mapDocFileOptions = {
  fromPcw: (payload: DocFileOptionsInput): ConfigDocFileOption => ({
    firstRowAsHeader: removeNulls(payload.firstRowAsHeader),
    customHeaderColumns: removeNulls(payload.customHeaderColumns),
  }),
};
