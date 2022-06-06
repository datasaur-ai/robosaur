import Ajv, { JSONSchemaType } from 'ajv';
import { ExportProjectListConfig } from '../interfaces';

const schemaValidator = new Ajv({ allErrors: true });

const ExportProjectListSchema: JSONSchemaType<ExportProjectListConfig> = {
  type: 'object',
  properties: {
    teamId: { type: 'string' },
    source: { type: 'string' },
    bucketName: { type: 'string' },
    path: { type: 'string' },
    projectFilter: {
      type: 'object',
      nullable: true,
      properties: {
        statuses: { type: 'array', items: { type: 'string' }, nullable: true },
        date: { type: 'object', nullable: true, required: ['newestDate'] },
        tags: { type: 'array', nullable: true, items: { type: 'string' } },
      },
    },
  },

  required: ['teamId', 'path'],
};

export const exportProjectListSchemaValidator = schemaValidator.compile(ExportProjectListSchema);
