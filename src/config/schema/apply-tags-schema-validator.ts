import Ajv, { JSONSchemaType } from "ajv";
import { ApplyTagsConfig } from "../interfaces";

const schemaValidator = new Ajv({
  allErrors: true,
});

const ApplyTagsSchema: JSONSchemaType<ApplyTagsConfig> = {
  type: 'object',
  properties: {
    teamId: { type: 'string' },
    source: { type: 'string' },
    path: { type: 'string' },
    bucketName: { type: 'string' },
    prefix: { type: 'string' },
    payload: { 
      type: 'array', 
      items: { 
        type: 'object',
        properties: {
          projectId: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        },
        required: ['projectId', 'tags']
      },
    }
  },
  required: ['teamId', 'source'],
}

export const applyTagsSchemaValidator = schemaValidator.compile(ApplyTagsSchema);
