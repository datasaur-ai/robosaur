import Ajv, { JSONSchemaType } from 'ajv';
import { IAssignmentConfig } from '../interfaces';

const schemaValidator = new Ajv({
  allErrors: true,
});

const AssignmentSchema: JSONSchemaType<IAssignmentConfig> = {
  type: 'object',
  properties: {
    source: { type: 'string' },
    path: { type: 'string' },
    bucketName: { type: 'string', nullable: true }, // nullable when local
  },
  required: ['path', 'source'],
};

export const assignmentSchemaValidator = schemaValidator.compile(AssignmentSchema);
