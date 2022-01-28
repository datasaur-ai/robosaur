import { getLogger } from '../../logger';
import { Config, StorageSources } from '../interfaces';
import { assignmentSchemaValidator } from './assignment-schema-validator';
import { credentialsSchemaValidator } from './credential-schema-validator';
import { documentsSchemaValidator } from './documents-schema-validator';
import { exportSchemaValidator } from './export-schema-validator';

export function getProjectCreationValidators() {
  return [validateConfigCredentials, validateConfigAssignment, validateConfigDocuments];
}

export function getProjectExportValidators() {
  return [validateConfigCredentials, validateConfigExport];
}

function validateConfigDocuments(config: Config) {
  if (!documentsSchemaValidator(config.documents)) {
    getLogger().error(`config.documents has some errors`, { errors: documentsSchemaValidator.errors });
    throw new Error(`config.documents has some errors: ${JSON.stringify(documentsSchemaValidator.errors)}`);
  }
}

function validateConfigAssignment(config: Config) {
  if (config.assignment) {
    if (!assignmentSchemaValidator(config.assignment)) {
      getLogger().error(`config.assignment has some errors`, { errors: assignmentSchemaValidator.errors });
      throw new Error(`config.assignment has some errors: ${JSON.stringify(assignmentSchemaValidator.errors)}`);
    }
  }
}

function validateConfigExport(config: Config) {
  if (!exportSchemaValidator(config.export)) {
    getLogger().error(`config.export has some errors`, { errors: exportSchemaValidator.errors });
    throw new Error(`config.export has some errors ${JSON.stringify({ errors: exportSchemaValidator.errors })}`);
  }
}

function validateConfigCredentials(config: Config) {
  if (config.credentials || doSourcesNeedCredentials(config)) {
    if (!credentialsSchemaValidator(config.credentials)) {
      getLogger().error(`config.credentials has some errors`, { errors: credentialsSchemaValidator.errors });
      throw new Error(`config.credentials has some errors ${JSON.stringify(credentialsSchemaValidator)}`);
    }
  }
}

function doSourcesNeedCredentials(config: Config) {
  const sourcesNeedCredentials = [StorageSources.AMAZONS3, StorageSources.GOOGLE];
  const usedSources = [
    config.assignment?.source,
    config.documents?.source,
    config.state?.source,
    config.export?.source,
  ];

  return usedSources.some((source) => sourcesNeedCredentials.includes(source));
}
