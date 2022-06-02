import Ajv, { JSONSchemaType, str } from 'ajv';
import { ExportFormat } from '../../datasaur/interfaces';
import { ExportProjectOverviewConfig, StorageSources } from '../interfaces';

const schemaValidator = new Ajv({ allErrors: true });

const ExportProjectOverviewSchema: JSONSchemaType<ExportProjectOverviewConfig> = {
  type: 'object',
  properties: {
    teamId: { type: 'string' },
    filename: { type: 'string' },
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

  required: ['teamId', 'filename'],
};

export const exportProjectOverviewSchemaValidator = schemaValidator.compile(ExportProjectOverviewSchema);
