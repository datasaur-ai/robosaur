import { getLogger } from '../../logger';
import { Config } from '../interfaces';
import { assignmentSchemaValidator } from './assignment-schema-validator';
import { documentsSchemaValidator } from './documents-schema-validator';
import { exportSchemaValidator } from './export-schema-validator';

export function getProjectCreationValidators() {
  return [validateConfigAssignment, validateConfigDocuments];
}

export function getProjectExportValidators() {
  return [validateConfigExport];
}

export function validateConfigDocuments(config: Config) {
  if (!documentsSchemaValidator(config.documents)) {
    getLogger().error(`config.documents has some errors`, { errors: documentsSchemaValidator.errors });
    throw new Error(`config.documents has some errors: ${JSON.stringify(documentsSchemaValidator.errors)}`);
  }
}

export function validateConfigAssignment(config: Config) {
  if (config.assignment) {
    if (!assignmentSchemaValidator(config.assignment)) {
      getLogger().error(`config.assignment has some errors`, { errors: assignmentSchemaValidator.errors });
      throw new Error(`config.assignment has some errors: ${JSON.stringify(assignmentSchemaValidator.errors)}`);
    }
  }
}

// TODO #10243
export function validateConfigExport(config: Config) {
  if (!exportSchemaValidator(config.export)) {
    getLogger().error(`config.export has some errors`, { errors: exportSchemaValidator.errors });
    throw new Error(`config.export has some errors ${JSON.stringify({ errors: exportSchemaValidator.errors })}`);
  }
}

// TODO #10243
function validateConfigCredentials(config: Config) {
  throw new Error('not implemented');
}
