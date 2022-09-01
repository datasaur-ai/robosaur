import { parseAssignment } from '../../assignment/parse-assignment';
import { getConfig } from '../../config/config';
import { Config } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { mapDocFileOptions } from './helper/doc-file-options.mapper';
import { mapDocumentAssignments } from './helper/document-assignments.mapper';
import { mapDocumentSettings } from './helper/document-settings.mapper';
import { getDatasaurVersion } from './helper/getDatasaurVersion';
import { mapLabelSet } from './helper/label-set.mapper';
import { parsePcw } from './helper/parsePcw';
import { DatasaurVersionMapper } from './helper/project-settings.mapper';
import { mapSplitDocumentOptions } from './helper/split-document-options.mapper';
import { validatePcw } from './helper/validatePcw';
import { PCWPayload } from './interfaces';

const populateConfig = async (payload: PCWPayload) => {
  getConfig().create.documentSettings = mapDocumentSettings.fromPcw(payload.documentSettings);

  const datasaurVersion = await getDatasaurVersion();
  const getProjectSettings = DatasaurVersionMapper.get(datasaurVersion)!;
  getConfig().create.projectSettings = getProjectSettings(payload);

  if (payload.documents && payload.documents.length > 0) {
    getConfig().create.docFileOptions = mapDocFileOptions.fromPcw(payload.documents[0].docFileOptions!);
  }

  if (payload.splitDocumentOption) {
    getConfig().create.splitDocumentOption = mapSplitDocumentOptions.fromPcw(payload.splitDocumentOption);
  }

  getConfig().create.kinds = payload.kinds;

  if (
    (getConfig().create.documentSettings.kind === 'TOKEN_BASED' || getConfig().create.kinds?.includes('TOKEN_BASED')) &&
    payload.labelSets &&
    payload.labelSets.length > 0
  ) {
    getConfig().create.labelSets = mapLabelSet.fromPcw(payload.labelSets);
  }

  if (
    (getConfig().create.documentSettings.kind === 'ROW_BASED' ||
      getConfig().create.documentSettings.kind === 'DOCUMENT_BASED' ||
      getConfig().create.kinds?.includes('ROW_BASED') ||
      getConfig().create.kinds?.includes('DOCUMENT_BASED')) &&
    payload.documents &&
    payload.documents.length > 0 &&
    payload.documents[0].settings?.questions &&
    payload.documents[0].settings?.questions.length > 0
  ) {
    getConfig().create.questions = payload.documents[0].settings?.questions;
  }

  if (payload.documentAssignments && payload.documentAssignments.length > 0) {
    getConfig().create.assignments = mapDocumentAssignments.fromPcw(payload.documentAssignments);
  }
  getConfig().create.type = payload.type;
  getConfig().create.kinds = payload.kinds || [];
  getConfig().create.tagNames = payload.tagNames;
};

export const setConfigFromPcw = async (input: Config) => {
  const { pcwPayloadSource, pcwPayload } = input.create;
  validatePcw(pcwPayloadSource, pcwPayload);
  let payload: PCWPayload;
  payload = await parsePcw(pcwPayloadSource!, pcwPayload!);

  if (!payload) {
    getLogger().error(`failed to load pcwPayload`);
    throw new Error('failed to load pcwPayload');
  }

  getLogger().info(`transforming payload to robosaur format...`);
  await populateConfig(payload);

  getLogger().info('finished transforming payload, continue to creating projects...');

  if (getConfig().create.assignment?.path && !getConfig().create.pcwAssignmentStrategy) {
    getConfig().create.assignments = await parseAssignment();
  }
};
