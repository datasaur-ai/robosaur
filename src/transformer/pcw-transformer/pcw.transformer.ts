import { getConfig } from '../../config/config';
import { Config } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { docFileOptionsMapper } from './helper/doc-file-options.mapper';
import { documentAssignmentsMapper } from './helper/document-assignments.mapper';
import { documentSettingsMapper } from './helper/document-settings.mapper';
import { labelSetMapper } from './helper/label-set.mapper';
import { pcwTransformerValidator } from './helper/pcw.transfomer.validator';
import { processPcw } from './helper/pcwProcessor';
import { projectSettingsMapper } from './helper/project-settings.mapper';
import { splitDocumentOptionsMapper } from './helper/split-document-options.mapper';
import { PCWPayload } from './interfaces';

const transform = (payload: PCWPayload) => {
  getConfig().project.documentSettings = documentSettingsMapper.fromPcw(payload.documentSettings);
  getConfig().project.projectSettings = projectSettingsMapper.fromPcw(payload.projectSettings);
  if (payload.documents && payload.documents.length > 0) {
    getConfig().project.docFileOptions = docFileOptionsMapper.fromPcw(payload.documents[0].docFileOptions!);
  }

  if (payload.splitDocumentOption) {
    getConfig().project.splitDocumentOption = splitDocumentOptionsMapper.fromPcw(payload.splitDocumentOption);
  }

  if (
    getConfig().project.documentSettings.kind === 'TOKEN_BASED' &&
    payload.labelSets &&
    payload.labelSets.length > 0
  ) {
    getConfig().project.labelSets = labelSetMapper.fromPcw(payload.labelSets);
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
    getConfig().project.assignments = documentAssignmentsMapper.fromPcw(payload.documentAssignments);
  }
};

export const pcwTransformer = async (input: Config) => {
  const { pcwPayloadSource, pcwPayload } = pcwTransformerValidator(input.project);
  let payload: PCWPayload;
  payload = await processPcw(pcwPayloadSource, pcwPayload);

  if (!payload) {
    getLogger().error(`failed to load pcwPayload`);
    throw new Error('failed to load pcwPayload');
  }

  getLogger().info(`transforming payload to robosaur format...`);
  transform(payload);
  getLogger().info('finished transforming payload, continue to creating projects...');
};
