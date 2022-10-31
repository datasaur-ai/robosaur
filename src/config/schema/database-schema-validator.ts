import Ajv, { JSONSchemaType } from 'ajv';
import { DatabaseConfig } from '../interfaces';

const schemaValidator = new Ajv({
  allErrors: true,
});

const DatabaseSchema: JSONSchemaType<DatabaseConfig> = {
  type: 'object',
  properties: {
    url: { type: 'string' },
    host: { type: 'string' },
    port: { type: 'number' },
    username: { type: 'string' },
    password: { type: 'string' },
    database: { type: 'string' },
    authSource: { type: 'string' },
  },
  required: ['database', 'authSource'],
  oneOf: [
    {
      required: ['url', 'database', 'authSource'],
    },
    {
      required: ['host', 'port', 'username', 'password', 'database', 'authSource'],
    },
  ],
};

export const databaseSchemaValidator = schemaValidator.compile(DatabaseSchema);
