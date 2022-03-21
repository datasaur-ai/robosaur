import { Config } from '../../../config/interfaces';
import { TextDocumentSettingsInput } from '../../../generated/graphql';

export const documentSettingsMapper = {
  fromPcw: (payload: TextDocumentSettingsInput): Config['project']['documentSettings'] => {
    if (!payload.kind || payload.kind === null) {
      throw new Error();
    }
    return {
      kind: payload.kind,
      customScriptId: payload.customScriptId!,
      allTokensMustBeLabeled: payload.allTokensMustBeLabeled!,
      allowArcDrawing: payload.allowArcDrawing!,
      textLabelMaxTokenLength: payload.textLabelMaxTokenLength!,
      allowCharacterBasedLabeling: payload.allowCharacterBasedLabeling!,
      displayedRows: payload.displayedRows!,
      mediaDisplayStrategy: payload.mediaDisplayStrategy!,
      firstRowAsHeader: payload.firstRowAsHeader!,
      viewer: payload.viewer!,
      viewerConfig: {
        urlColumnNames: payload.viewerConfig?.urlColumnNames!,
      },
      enableTabularMarkdownParsing: payload.enableTabularMarkdownParsing!,
    };
  },
};
