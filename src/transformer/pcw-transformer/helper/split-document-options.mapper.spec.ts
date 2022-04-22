import { Config, SplitDocumentStrategy } from '../../../config/interfaces';
import {
  SplitDocumentOptionInput,
  SplitDocumentStrategy as SplitDocumentStrategyPCW,
} from '../../../generated/graphql';
import { mapSplitDocumentOptions } from './split-document-options.mapper';

describe('splitDocumentOptionsMapper', () => {
  it('should map splitDocumentOptions from PCW to robosaur config', () => {
    const fromPcw: SplitDocumentOptionInput = {
      strategy: SplitDocumentStrategyPCW.ByParts,
      number: 2,
    };

    const mapped: Config['create']['splitDocumentOption'] = {
      strategy: SplitDocumentStrategy.BY_PARTS,
      number: 2,
    };

    const result = mapSplitDocumentOptions.fromPcw(fromPcw);

    expect(result).toEqual(mapped);
  });
});
