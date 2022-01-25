import Ajv, { JSONSchemaType } from 'ajv';
import { StorageSources } from '../interfaces';

const schemaValidator = new Ajv({
  allErrors: true,
});

interface LocalDocuments {
  source: StorageSources.LOCAL;
  path: string;
}

interface RemoteDocuments {
  source: StorageSources.REMOTE;
  path: string;
}

interface GCSDocuments {
  source: StorageSources.GOOGLE;
  bucketName: string;
  prefix: string;
  gcsCredentialJson: string;
}

interface S3Documents {
  source: StorageSources.AMAZONS3;
  bucketName: string;
  prefix: string;
  s3Endpoint: string;
  s3Port: number;
  s3AccessKey: string;
  s3SecretKey: string;
  s3UseSSL: boolean;
}

type DocumentsConfig = LocalDocuments | RemoteDocuments | GCSDocuments | S3Documents;

const DocumentsSchema: JSONSchemaType<DocumentsConfig> = {
  type: 'object',
  properties: {
    source: { type: 'string' },
    path: { type: 'string' },
    bucketName: { type: 'string' },
    prefix: { type: 'string' },
    gcsCredentialJson: { type: 'string' },
    s3AccessKey: { type: 'string' },
    s3SecretKey: { type: 'string' },
    s3Endpoint: { type: 'string' },
    s3Port: { type: 'number' },
    s3UseSSL: { type: 'boolean' },
    stateFilePath: { type: 'string', nullable: true },
  },
  required: ['source'],
  oneOf: [
    { required: ['source', 'path'] },
    { required: ['source', 'bucketName', 'prefix', 'gcsCredentialJson'] },
    { required: ['source', 'bucketName', 'prefix', 's3AccessKey', 's3SecretKey', 's3Endpoint', 's3Port', 's3UseSSL'] },
  ],
};

export const documentsSchemaValidator = schemaValidator.compile(DocumentsSchema);
