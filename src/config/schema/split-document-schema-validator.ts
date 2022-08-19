import Ajv, { JSONSchemaType } from 'ajv';
import { SplitDocumentConfig } from '../interfaces';

const schemaValidator = new Ajv({
  allErrors: true,
});

const SplitDocumentSchema: JSONSchemaType<SplitDocumentConfig> = {
  type: 'object',
  properties: {
    path: { type: 'string' },
    header: { type: 'boolean' },
    linesPerFile: { type: 'number' },
    filesPerFolder: { type: 'number' },
    resultFolder: { type: 'string' },
  },
  required: ['path', 'header', 'linesPerFile', 'filesPerFolder', 'resultFolder'],
};

export const splitDocumentSchemaValidator = schemaValidator.compile(SplitDocumentSchema);
