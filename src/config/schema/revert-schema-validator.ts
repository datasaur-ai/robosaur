import Ajv, { JSONSchemaType } from 'ajv';
import { getLogger } from '../../logger';
import { Config, RevertConfig, StorageSources } from '../interfaces';
import { credentialsSchemaValidator } from './credential-schema-validator';

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
      else: {
        required: ['source', 'path', 'teamId'],
      },
    },
  ],
};

const revertSchemaValidator = schemaValidator.compile(RevertSchema);

function validateRevertSchema(config: Config) {
  if (!revertSchemaValidator(config.revert)) {
    getLogger().error(`config.revert has some errors`, { errors: revertSchemaValidator.errors });
    throw new Error(`config.revert has some errors: ${JSON.stringify(revertSchemaValidator.errors)}`);
  }

  if ([StorageSources.AMAZONS3, StorageSources.AZURE, StorageSources.GOOGLE].includes(config.revert.source)) {
    if (!credentialsSchemaValidator(config.credentials)) {
      getLogger().error(`config.credentials has some errors`, { errors: credentialsSchemaValidator.errors });
      throw new Error(`config.credentials has some errors ${credentialsSchemaValidator}`);
    }
  }
}

export function getRevertProjectStatusValidator() {
  return [validateRevertSchema];
}
