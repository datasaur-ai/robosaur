import { getConfig } from '../../config/config';
import { Config, CreateConfig } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { mapDocFileOptions } from './helper/doc-file-options.mapper';
import { mapDocumentAssignments } from './helper/document-assignments.mapper';
import { mapDocumentSettings } from './helper/document-settings.mapper';
import { mapLabelSet } from './helper/label-set.mapper';
import { mapProjectSettings } from './helper/project-settings.mapper';
import { mapSplitDocumentOptions } from './helper/split-document-options.mapper';
import { PCWPayload, PCWWrapper } from './interfaces';

const populateConfig = (payload: PCWPayload) => {
  getConfig().project = {
    documentSettings: mapDocumentSettings.fromPcw(payload.documentSettings),
    projectSettings: mapProjectSettings.fromPcw(payload.projectSettings),
    docFileOptions:
      payload.documents && payload.documents.length > 0
        ? mapDocFileOptions.fromPcw(payload.documents[0].docFileOptions!)
        : undefined,
    splitDocumentOption: payload.splitDocumentOption
      ? mapSplitDocumentOptions.fromPcw(payload.splitDocumentOption)
      : undefined,
    labelSets:
      payload.documentSettings.kind === 'TOKEN_BASED' && payload.labelSets && payload.labelSets.length > 0
        ? mapLabelSet.fromPcw(payload.labelSets)
        : undefined,
    questions:
      (payload.documentSettings.kind === 'ROW_BASED' || payload.documentSettings.kind === 'DOCUMENT_BASED') &&
      payload.documents &&
      payload.documents.length > 0 &&
      payload.documents[0].settings?.questions &&
      payload.documents[0].settings?.questions.length > 0
        ? payload.documents[0].settings?.questions
        : undefined,
    assignments:
      payload.documentAssignments && payload.documentAssignments.length > 0
        ? mapDocumentAssignments.fromPcw(payload.documentAssignments)
        : undefined,
    teamId: payload.teamId,
  };
};

export const setConfigFromPcw = async (input: Config) => {
  const pcwPayload = input.create as PCWWrapper;
  let payload: PCWPayload;
  payload = pcwPayload?.variables.input;

  if (!payload) {
    getLogger().error(`failed to load pcwPayload`);
    throw new Error('failed to load pcwPayload');
  }

  getLogger().info(`transforming payload to robosaur format...`);
  populateConfig(payload);
  getConfig().project.pcwAssignmentStrategy = pcwPayload.pcwAssignmentStrategy;
  getLogger().info('finished transforming payload, continue to creating projects...');
};
