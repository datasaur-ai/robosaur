import Ajv, { JSONSchemaType } from 'ajv';
import { AssignmentConfig } from '../interfaces';

const schemaValidator = new Ajv({
  allErrors: true,
});

const AssignmentSchema: JSONSchemaType<AssignmentConfig> = {
  type: 'object',
  properties: {
    source: { type: 'string' },
    path: { type: 'string' },
    by: { enum: ['PROJECT', 'DOCUMENT'], default: 'DOCUMENT', type: 'string' },
    strategy: { enum: ['ALL', 'AUTO'], default: 'ALL', type: 'string' },
    bucketName: { type: 'string', nullable: true }, // nullable when local
  },
  required: ['path', 'source'],
};

export const assignmentSchemaValidator = schemaValidator.compile(AssignmentSchema);
