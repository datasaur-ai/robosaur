import Ajv, { JSONSchemaType } from 'ajv';
import { StorageSources } from '../interfaces';

const schemaValidator = new Ajv({
  allErrors: true,
});

interface AssignmentConfig {
  source: StorageSources;
  path: string;
}

const AssignmentSchema: JSONSchemaType<AssignmentConfig> = {
  type: 'object',
  properties: {
    source: { type: 'string' },
    path: { type: 'string' },
  },
  required: ['path', 'source'],
};

export const assignmentSchemaValidator = schemaValidator.compile(AssignmentSchema);
