import { getConfig } from '../../config/config';
import { Config } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { mapDocFileOptions } from './helper/doc-file-options.mapper';
import { mapDocumentAssignments } from './helper/document-assignments.mapper';
import { mapDocumentSettings } from './helper/document-settings.mapper';
import { mapLabelSet } from './helper/label-set.mapper';
import { validatePcw } from './helper/validatePcw';
import { parsePcw } from './helper/parsePcw';
import { mapProjectSettings } from './helper/project-settings.mapper';
import { mapSplitDocumentOptions } from './helper/split-document-options.mapper';
import { PCWPayload } from './interfaces';

const populateConfig = (payload: PCWPayload) => {
  getConfig().project.documentSettings = mapDocumentSettings.fromPcw(payload.documentSettings);
  getConfig().project.projectSettings = mapProjectSettings.fromPcw(payload.projectSettings);
  if (payload.documents && payload.documents.length > 0) {
    getConfig().project.docFileOptions = mapDocFileOptions.fromPcw(payload.documents[0].docFileOptions!);
  }

  if (payload.splitDocumentOption) {
    getConfig().project.splitDocumentOption = mapSplitDocumentOptions.fromPcw(payload.splitDocumentOption);
  }

  if (
    getConfig().project.documentSettings.kind === 'TOKEN_BASED' &&
    payload.labelSets &&
    payload.labelSets.length > 0
  ) {
    getConfig().project.labelSets = mapLabelSet.fromPcw(payload.labelSets);
  }

  if (
    (getConfig().project.documentSettings.kind === 'ROW_BASED' ||
      getConfig().project.documentSettings.kind === 'DOCUMENT_BASED') &&
    payload.documents &&
    payload.documents.length > 0 &&
    payload.documents[0].settings?.questions &&
    payload.documents[0].settings?.questions.length > 0
  ) {
    getConfig().project.questions = payload.documents[0].settings?.questions;
  }

  if (payload.documentAssignments && payload.documentAssignments.length > 0) {
    getConfig().project.assignments = mapDocumentAssignments.fromPcw(payload.documentAssignments);
  }
  getConfig().project.type = payload.type;
  getConfig().project.kinds = payload.kinds || [];
};

export const setConfigFromPcw = async (input: Config) => {
  const { pcwPayloadSource, pcwPayload } = input.project;
  validatePcw(pcwPayloadSource, pcwPayload);
  let payload: PCWPayload;
  payload = await parsePcw(pcwPayloadSource!, pcwPayload!);

  if (!payload) {
    getLogger().error(`failed to load pcwPayload`);
    throw new Error('failed to load pcwPayload');
  }

  getLogger().info(`transforming payload to robosaur format...`);
  populateConfig(payload);
  getLogger().info('finished transforming payload, continue to creating projects...');
};
