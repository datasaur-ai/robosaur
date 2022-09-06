import Ajv, { JSONSchemaType } from 'ajv';
import { ExportTranscriptionConfig, StorageSources } from '../interfaces';

const schemaValidator = new Ajv({ allErrors: true });

const ExportTranscriptionSchema: JSONSchemaType<ExportTranscriptionConfig> = {
  type: 'object',
  properties: {
    source: { type: 'string' },
    bucketName: { type: 'string' },
    prefix: { type: 'string' },
    teamId: { type: 'string' },
    projectId: { nullable: true, type: 'string' },
    exportedTag: { type: 'string', nullable: true },
    statusFilter: { type: 'array', items: { type: 'string' } },
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

  required: ['teamId'],
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
export const exportTranscriptionSchemaValidator = schemaValidator.compile(ExportTranscriptionSchema);
