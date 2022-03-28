import { Config } from '../../../config/interfaces';
import { TextDocumentSettingsInput } from '../../../generated/graphql';
import { removeNulls } from './removeNull';

export const documentSettingsMapper = {
  fromPcw: (payload: TextDocumentSettingsInput): Config['project']['documentSettings'] => {
    if (!payload.kind || payload.kind === null) {
      throw new Error();
    }
    return {
      kind: payload.kind,
      customScriptId: removeNulls(payload.customScriptId),
      allTokensMustBeLabeled: removeNulls(payload.allTokensMustBeLabeled),
      allowArcDrawing: removeNulls(payload.allowArcDrawing),
      textLabelMaxTokenLength: removeNulls(payload.textLabelMaxTokenLength),
      allowCharacterBasedLabeling: removeNulls(payload.allowCharacterBasedLabeling),
      displayedRows: removeNulls(payload.displayedRows),
      mediaDisplayStrategy: removeNulls(payload.mediaDisplayStrategy),
      firstRowAsHeader: removeNulls(payload.firstRowAsHeader),
      viewer: removeNulls(payload.viewer),
      viewerConfig: {
        urlColumnNames: removeNulls(payload.viewerConfig?.urlColumnNames),
      },
      enableTabularMarkdownParsing: removeNulls(payload.enableTabularMarkdownParsing),
    };
  },
};