import { Config } from '../interfaces';
import { assignmentSchemaValidator } from './assignment-schema-validator';
import { documentsSchemaValidator } from './documents-schema-validator';

export function validateConfigDocuments(config: Config) {
  if (!documentsSchemaValidator(config.documents)) {
    throw new Error(`config.documents has some errors: ${JSON.stringify(documentsSchemaValidator.errors)}`);
  }
}

export function validateConfigAssignment(config: Config) {
  if (config.assignment) {
    if (!assignmentSchemaValidator(config.assignment)) {
      throw new Error(`config.assignment has some errors: ${JSON.stringify(assignmentSchemaValidator.errors)}`);
    }
  }
}
