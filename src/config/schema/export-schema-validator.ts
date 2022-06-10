import Ajv, { JSONSchemaType } from 'ajv';
import { ExportFormat } from '../../datasaur/interfaces';
import { TextDocumentKind } from '../../generated/graphql';
import { ExportConfig, StateConfig, StorageSources } from '../interfaces';

const schemaValidator = new Ajv({ allErrors: true });

const ExportSchema: JSONSchemaType<ExportConfig> = {
  type: 'object',
  properties: {
    teamId: { type: 'string' },
    format: { type: 'string' },
    statusFilter: { type: 'array', items: { type: 'string' } },
    source: { type: 'string' },
    bucketName: { type: 'string' },
    prefix: { type: 'string' },
    fileTransformerId: { type: 'string', nullable: true },
    executionMode: { type: 'string', enum: [StateConfig.STATEFUL, StateConfig.STATELESS], nullable: true },
    projectFilter: {
      type: 'object',
      nullable: true,
      required: ['kind'],
      properties: {
        kind: {
          type: 'string',
          enum: [TextDocumentKind.TokenBased, TextDocumentKind.RowBased, TextDocumentKind.DocumentBased],
        },
        date: { type: 'object', nullable: true, required: ['newestDate'] },
        tags: { type: 'array', nullable: true, items: { type: 'string' } },
      },
    },
  },

  required: ['teamId', 'format', 'statusFilter'],
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
  if: {
    properties: {
      format: {
        enum: [ExportFormat.CUSTOM],
      },
    },
    required: ['format'],
  },
  then: {
    properties: {
      fileTransformerId: { type: 'string', nullable: false },
    },
    required: ['fileTransformerId'],
  },
};

export const exportSchemaValidator = schemaValidator.compile(ExportSchema);
