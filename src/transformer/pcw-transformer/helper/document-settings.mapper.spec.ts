import { Config } from '../../../config/interfaces';
import {
  MediaDisplayStrategy,
  TextDocumentKind,
  TextDocumentSettingsInput,
  TextDocumentViewer,
  TokenizationMethod,
  TranscriptMethod,
} from '../../../generated/graphql';
import { mapDocumentSettings } from './document-settings.mapper';

describe('documentSettingsMapper', () => {
  it('should map documentSettings from PCW to robosaur config', () => {
    const fromPcw: TextDocumentSettingsInput = {
      allTokensMustBeLabeled: false,
      allowArcDrawing: false,
      allowCharacterBasedLabeling: false,
      allowMultiLabels: true,
      autoScrollWhenLabeling: true,
      textLabelMaxTokenLength: 999999,
      sentenceSeparator: '\n',
      tokenizer: 'WINK',
      transcriptMethod: TranscriptMethod.Transcription,
      displayedRows: -1,
      kind: TextDocumentKind.TokenBased,
      mediaDisplayStrategy: MediaDisplayStrategy.Thumbnail,
      viewer: TextDocumentViewer.Token,
      viewerConfig: {
        urlColumnNames: [],
      },
      firstRowAsHeader: false,
      enableTabularMarkdownParsing: false,
      enableAnonymization: false,
      anonymizationEntityTypes: [
        'PERSON',
        'DATE_TIME',
        'EMAIL_ADDRESS',
        'PHONE_NUMBER',
        'ORGANIZATION',
        'LOCATION',
        'DOMAIN_NAME',
        'IP_ADDRESS',
        'US_PASSPORT',
        'CREDIT_CARD',
        'US_SSN',
        'US_ITIN',
        'US_BANK_NUMBER',
        'US_DRIVER_LICENSE',
        'IBAN_CODE',
      ],
      customScriptId: '1',
    };

    const mapped: Config['create']['documentSettings'] = {
      allTokensMustBeLabeled: false,
      allowArcDrawing: false,
      allowCharacterBasedLabeling: false,
      textLabelMaxTokenLength: 999999,
      allowMultiLabels: true,
      sentenceSeparator: '\n',
      autoScrollWhenLabeling: true,
      displayedRows: -1,
      kind: TextDocumentKind.TokenBased,
      mediaDisplayStrategy: MediaDisplayStrategy.Thumbnail,
      tokenizer: TokenizationMethod.Wink,
      transcriptMethod: TranscriptMethod.Transcription,
      viewer: TextDocumentViewer.Token,
      viewerConfig: {
        urlColumnNames: [],
      },
      firstRowAsHeader: false,
      enableTabularMarkdownParsing: false,
      customScriptId: '1',
    };

    const result = mapDocumentSettings.fromPcw(fromPcw);

    expect(result).toEqual(mapped);
  });
});
