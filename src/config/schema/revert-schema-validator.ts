import Ajv, { JSONSchemaType } from 'ajv';
import { RevertConfig, StorageSources } from '../interfaces';

const schemaValidator = new Ajv({ allErrors: true });

const RevertSchema: JSONSchemaType<RevertConfig> = {
  type: 'object',
  properties: {
    bucketName: { type: 'string', nullable: true },
    path: { type: 'string' },
    source: {
      type: 'string',
      enum: [StorageSources.LOCAL, StorageSources.AMAZONS3, StorageSources.AZURE, StorageSources.GOOGLE],
    },
    teamId: { type: 'string' },
  },

  required: ['source', 'path', 'teamId'],
  oneOf: [
    {
      if: {
        properties: {
          source: { enum: [StorageSources.AMAZONS3, StorageSources.AZURE, StorageSources.GOOGLE] },
        },
      },
      then: { required: ['source', 'path', 'teamId', 'bucketName'] },
    },
    {
      if: {
        properties: {
          source: { enum: [StorageSources.LOCAL] },
        },
      },
      then: { required: ['source', 'path', 'teamId'] },
    },
  ],
};
