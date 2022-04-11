import Ajv, { JSONSchemaType } from 'ajv';
import { DocumentsConfig } from '../interfaces';

const schemaValidator = new Ajv({
  allErrors: true,
});

const DocumentsSchema: JSONSchemaType<DocumentsConfig> = {
  type: 'object',
  properties: {
    source: { type: 'string' },
    path: { type: 'string' },
    bucketName: { type: 'string' },
    prefix: { type: 'string' },
    kontext: { type: 'object', required: ['uploadPath', 'stagingFolderPath', 'zipRootPath'], nullable: true },
  },
  required: ['source'],
  oneOf: [{ required: ['source', 'path'] }, { required: ['source', 'bucketName', 'prefix'] }],
};

export const documentsSchemaValidator = schemaValidator.compile(DocumentsSchema);
