import Ajv, { JSONSchemaType } from 'ajv';
import { UpdateCustomAPIConfig } from '../interfaces';

const schemaValidator = new Ajv({ allErrors: true });

const UpdateCustomAPISchema: JSONSchemaType<UpdateCustomAPIConfig> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    endpointURL: { type: 'string' },
    secret: { type: 'string', nullable: true },
  },
  required: ['id', 'name', 'endpointURL'],
};

export const updateCustomAPISchemaValidator = schemaValidator.compile(UpdateCustomAPISchema);
