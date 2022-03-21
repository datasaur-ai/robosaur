import { Config, SplitDocumentStrategy } from '../../../config/interfaces';
import {
  SplitDocumentOptionInput,
  SplitDocumentStrategy as SplitDocumentStrategyPCW,
} from '../../../generated/graphql';

export const splitDocumentOptionsMapper = {
  fromPcw: (payload: SplitDocumentOptionInput): Config['project']['splitDocumentOption'] => {
    return {
      strategy: splitDocumentOptionsMapper.strategyConverter(payload.strategy),
      number: payload.number,
    };
  },
  strategyConverter: (fromPcw: SplitDocumentStrategyPCW) => {
    switch (fromPcw) {
      case SplitDocumentStrategyPCW.ByParts:
        return SplitDocumentStrategy.BY_PARTS;
      case SplitDocumentStrategyPCW.DontSplit:
        return SplitDocumentStrategy.DONT_SPLIT;
    }
  },
};
