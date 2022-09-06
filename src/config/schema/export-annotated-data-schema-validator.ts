import Ajv, { JSONSchemaType } from 'ajv';
import { ExportAnnotatedDataConfig, StorageSources } from '../interfaces';

const schemaValidator = new Ajv({ allErrors: true });

const ExportAnnotatedDataSchema: JSONSchemaType<ExportAnnotatedDataConfig> = {
  type: 'object',
  properties: {
    teamId: { type: 'string' },
    statusFilter: { type: 'array', items: { type: 'string' } },
    source: { type: 'string' },
    bucketName: { type: 'string' },
    prefix: { type: 'string' },
    exportedTag: { type: 'string', nullable: true },
    projectFilter: {
      type: 'object',
      nullable: true,
      properties: {
        date: { type: 'object', nullable: true, required: ['newestDate'] },
        tags: { type: 'array', nullable: true, items: { type: 'string' } },
        keyword: { type: 'string', nullable: true },
      },
    },
  },

  required: ['teamId', 'statusFilter'],
  oneOf: [
    {
      if: {
        properties: {
          source: { enum: [StorageSources.AMAZONS3, StorageSources.GOOGLE, StorageSources.AZURE] },
        },
      },
      required: ['source'],
      then: {
        required: ['source', 'prefix', 'bucketName'],
      },
      else: {
        required: ['source', 'prefix'],
      },
    },
  ],
};

export const exportAnnotatedDataSchemaValidator = schemaValidator.compile(ExportAnnotatedDataSchema);
