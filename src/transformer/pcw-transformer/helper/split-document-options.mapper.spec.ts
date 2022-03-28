import { Config, SplitDocumentStrategy } from '../../../config/interfaces';
import {
  SplitDocumentOptionInput,
  SplitDocumentStrategy as SplitDocumentStrategyPCW,
} from '../../../generated/graphql';
import { splitDocumentOptionsMapper } from './split-document-options.mapper';

describe('splitDocumentOptionsMapper', () => {
  it('should map splitDocumentOptions from PCW to robosaur config', () => {
    const fromPcw: SplitDocumentOptionInput = {
      strategy: SplitDocumentStrategyPCW.ByParts,
      number: 2,
    };

    const mapped: Config['project']['splitDocumentOption'] = {
      strategy: SplitDocumentStrategy.BY_PARTS,
      number: 2,
    };

    const result = splitDocumentOptionsMapper.fromPcw(fromPcw);

    expect(result).toEqual(mapped);
  });
});