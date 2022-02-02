import Ajv, { JSONSchemaType } from 'ajv';
import { CredentialsConfig, StorageSources } from '../interfaces';

const schemaValidator = new Ajv({
  allErrors: true,
});

const CredentialsSchema: JSONSchemaType<CredentialsConfig> = {
  type: 'object',
  properties: {
    [StorageSources.AMAZONS3]: {
      type: 'object',
      properties: {
        s3Endpoint: { type: 'string' },
        s3Port: { type: 'integer' },
        s3UseSSL: { type: 'boolean' },
        s3AccessKey: { type: 'string' },
        s3SecretKey: { type: 'string' },
      },
      required: ['s3Endpoint', 's3Port', 's3UseSSL', 's3AccessKey', 's3SecretKey'],
    },
    [StorageSources.GOOGLE]: {
      type: 'object',
      properties: {
        gcsCredentialJson: { type: 'string' },
      },
      required: ['gcsCredentialJson'],
    },
  },
  required: [],
};

export const credentialsSchemaValidator = schemaValidator.compile(CredentialsSchema);
