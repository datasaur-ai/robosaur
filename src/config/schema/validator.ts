import { assignmentSchemaValidator } from './assignment-schema-validator';
import { documentsSchemaValidator } from './documents-schema-validator';

export function validateConfigDocuments(config) {
  if (!documentsSchemaValidator(config.documents)) {
    return Promise.reject(
      new Error(`config.documents has some errors: ${JSON.stringify(documentsSchemaValidator.errors)}`),
    );
  }
  return Promise.resolve();
}

export function validateConfigAssignment(config) {
  if (config.assignment) {
    if (!assignmentSchemaValidator(config.assignment)) {
      return Promise.reject(
        Error(`config.assignment has some errors: ${JSON.stringify(assignmentSchemaValidator.errors)}`),
      );
    }
    return Promise.resolve();
  }
  return Promise.resolve();
}
