import { getLogger } from '../../logger';
import { Config, StorageSources } from '../interfaces';
import { applyTagsSchemaValidator } from './apply-tags-schema-validator';
import { assignmentSchemaValidator } from './assignment-schema-validator';
import { credentialsSchemaValidator } from './credential-schema-validator';
import { databaseSchemaValidator } from './database-schema-validator';
import { documentsSchemaValidator } from './documents-schema-validator';
import { exportSchemaValidator } from './export-schema-validator';
import { splitDocumentSchemaValidator } from './split-document-schema-validator';

export function getProjectCreationValidators() {
  return [validateConfigCredentials, validateConfigAssignment, validateConfigDocuments];
}

export function getProjectExportValidators() {
  return [validateConfigCredentials, validateConfigExport];
}

export function getApplyTagValidators() {
  return [validateConfigCredentials, validateConfigApplyTags];
}

export function getSplitDocumentValidators() {
  return [validateConfigSplitDocument];
}

export function getDatabaseValidators() {
  return [validateConfigDatabase];
}

function validateConfigDatabase(config: Config) {
  if (!databaseSchemaValidator(config.splitDocument)) {
    getLogger().error(`config.database has some errors`, { errors: databaseSchemaValidator.errors });
    throw new Error(`config.database has some errors: ${JSON.stringify(databaseSchemaValidator.errors)}`);
  }
}

function validateConfigSplitDocument(config: Config) {
  if (!splitDocumentSchemaValidator(config.splitDocument)) {
    getLogger().error(`config.splitDocument has some errors`, { errors: splitDocumentSchemaValidator.errors });
    throw new Error(`config.splitDocument has some errors: ${JSON.stringify(splitDocumentSchemaValidator.errors)}`);
  }
}

function validateConfigDocuments(config: Config) {
  if (!documentsSchemaValidator(config.create?.files)) {
    getLogger().error(`config.documents has some errors`, { errors: documentsSchemaValidator.errors });
    throw new Error(`config.documents has some errors: ${JSON.stringify(documentsSchemaValidator.errors)}`);
  }
}

function validateConfigAssignment(config: Config) {
  if (config.create?.assignment) {
    if (!assignmentSchemaValidator(config.create.assignment)) {
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

function validateConfigApplyTags(config: Config) {
  if (!applyTagsSchemaValidator(config.applyTags)) {
    getLogger().error(`config.applyTags has some errors`, { errors: applyTagsSchemaValidator.errors });
    throw new Error(`config.applyTags has some errors ${JSON.stringify(applyTagsSchemaValidator)}`);
  }
}

function doSourcesNeedCredentials(config: Config) {
  const sourcesNeedCredentials = [StorageSources.AMAZONS3, StorageSources.GOOGLE, StorageSources.AZURE];
  const usedSources = [
    config.create?.assignment?.source,
    config.create?.files?.source,
    config.projectState?.source,
    config.export?.source,
    config.applyTags?.source,
  ];

  return usedSources.some((source) => (source ? sourcesNeedCredentials.includes(source) : false));
}
