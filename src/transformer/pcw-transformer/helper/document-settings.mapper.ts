import { Config } from '../../../config/interfaces';
import { TextDocumentSettingsInput } from '../../../generated/graphql';
import { removeNulls } from './removeNull';

export type ConfigDocumentSettings = Config['create']['documentSettings'];

export const mapDocumentSettings = {
  fromPcw: (payload: TextDocumentSettingsInput): ConfigDocumentSettings => {
    return {
      kind: removeNulls(payload.kind),
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
      transcriptMethod: removeNulls(payload.transcriptMethod),
      tokenizer: removeNulls(payload.tokenizer),
      allowMultiLabels: removeNulls(payload.allowMultiLabels),
      autoScrollWhenLabeling: removeNulls(payload.autoScrollWhenLabeling),
      sentenceSeparator: removeNulls(payload.sentenceSeparator),
      anonymizationEntityTypes: removeNulls(payload.anonymizationEntityTypes),
      anonymizationMaskingMethod: removeNulls(payload.anonymizationMaskingMethod),
      anonymizationRegExps: removeNulls(payload.anonymizationRegExps),
      fileTransformerId: removeNulls(payload.fileTransformerId),
      enableAnonymization: removeNulls(payload.enableAnonymization),
    };
  },
};
