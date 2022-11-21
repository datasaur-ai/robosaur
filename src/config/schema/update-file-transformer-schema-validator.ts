import Ajv, { JSONSchemaType } from 'ajv';
import { UpdateFileTransformerConfig } from '../interfaces';

const schemaValidator = new Ajv({ allErrors: true });

const UpdateFileTransformerSchema: JSONSchemaType<UpdateFileTransformerConfig> = {
  type: 'object',
  properties: {
    fileTransformerId: { type: 'string' },
    path: { type: 'string' },
  },
  required: ['fileTransformerId', 'path'],
};

export const updateFileTransformerSchemaValidator = schemaValidator.compile(UpdateFileTransformerSchema);
