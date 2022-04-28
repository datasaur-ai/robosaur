import { Config } from '../../../config/interfaces';
import { DocFileOptionsInput } from '../../../generated/graphql';
import { mapDocFileOptions } from './doc-file-options.mapper';

describe('docFileOptionsMapper', () => {
  it('should map docFileOptions from PCW to robosaur config', () => {
    const fromPcw: DocFileOptionsInput = {
      firstRowAsHeader: false,
      customHeaderColumns: [
        {
          displayed: true,
          labelerRestricted: false,
          name: 'column1',
        },
      ],
    };

    const mapped: Config['create']['docFileOptions'] = {
      firstRowAsHeader: false,
      customHeaderColumns: [
        {
          displayed: true,
          labelerRestricted: false,
          name: 'column1',
        },
      ],
    };

    const result = mapDocFileOptions.fromPcw(fromPcw);

    expect(result).toEqual(mapped);
  });
});
