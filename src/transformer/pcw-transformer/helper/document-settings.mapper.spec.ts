import { Config } from '../../../config/interfaces';
import {
  MediaDisplayStrategy,
  TextDocumentKind,
  TextDocumentSettingsInput,
  TextDocumentViewer,
} from '../../../generated/graphql';
import { mapDocumentSettings } from './document-settings.mapper';

describe('documentSettingsMapper', () => {
  it('should map documentSettings from PCW to robosaur config', () => {
    const fromPcw: TextDocumentSettingsInput = {
      allTokensMustBeLabeled: false,
      allowArcDrawing: false,
      allowCharacterBasedLabeling: false,
      allowMultiLabels: true,
      textLabelMaxTokenLength: 999999,
      sentenceSeparator: '\n',
      tokenizer: 'WINK',
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
      displayedRows: -1,
      kind: TextDocumentKind.TokenBased,
      mediaDisplayStrategy: MediaDisplayStrategy.Thumbnail,
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
