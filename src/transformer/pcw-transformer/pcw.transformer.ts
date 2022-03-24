import { getConfig } from '../../config/config';
import { Config, StorageSources } from '../../config/interfaces';
import { getLogger } from '../../logger';
import { getStorageClient } from '../../utils/object-storage';
import { ObjectStorageClient } from '../../utils/object-storage/interfaces';
import { readJSONFile } from '../../utils/readJSONFile';
import { PcwPayloadNotProvided } from './error/pcw-payload-not-provided.error';
import { WrongPcwPayloadType } from './error/wrong-pcw-payload-type.error';
import { docFileOptionsMapper } from './helper/doc-file-options.mapper';
import { documentAssignmentsMapper } from './helper/document-assignments.mapper';
import { documentSettingsMapper } from './helper/document-settings.mapper';
import { labelSetMapper } from './helper/label-set.mapper';
import { projectSettingsMapper } from './helper/project-settings.mapper';
import { splitDocumentOptionsMapper } from './helper/split-document-options.mapper';
import { PCWPayload } from './interfaces';

export const pcwTransformer = async (input: Config) => {
  const { pcwPayloadSource, pcwPayload } = input.project;
  if (!pcwPayloadSource) {
    getLogger().error('usePcw is true but pcwPayloadSource is not provided, please provide pcwPayloadSource');
    throw new PcwPayloadNotProvided();
  }
  if (!pcwPayload) {
    getLogger().error('usePcw is true but pcwPayload is not provided, please provide pcwPayload');
    throw new PcwPayloadNotProvided();
  }
  let payload: PCWPayload;
  if (pcwPayloadSource?.source === StorageSources.INLINE) {
    if (typeof pcwPayload === 'string') {
      getLogger().error('pcwPayloadSource is "inline" but pcwPayload is given a string');
      throw new WrongPcwPayloadType('INLINE', 'string');
    }
    payload = pcwPayload?.variables.input || pcwPayload;
  } else if (pcwPayloadSource?.source === StorageSources.LOCAL) {
    getLogger().info(`retrieving folders in local directory ${pcwPayload} `);
    if (typeof pcwPayload !== 'string') {
      getLogger().error(`pcwPayloadSource is ${pcwPayloadSource?.source} but pcwPayload is not given a string`);
      throw new WrongPcwPayloadType(pcwPayloadSource?.source, 'NOT string');
    }
    const readResult = readJSONFile(pcwPayload);
    payload = readResult?.variables.input || readResult;
  } else {
    getLogger().info(`retrieving pcw configuration in bucket ${pcwPayloadSource?.bucketName}`);
    if (typeof pcwPayload !== 'string') {
      getLogger().error(`pcwPayloadSource is ${pcwPayloadSource?.source} but pcwPayload is not given a string`);
      throw new WrongPcwPayloadType(pcwPayloadSource?.source, 'NOT string');
    }
    if (!pcwPayloadSource?.bucketName) {
      getLogger().error(`bucketName not provided`);
      throw new Error('bucketName not provided');
    }
    const storageClient: ObjectStorageClient = getStorageClient(pcwPayloadSource?.source);
    const payloadString = await storageClient.getStringFileContent(pcwPayloadSource.bucketName, pcwPayload);
    const readResult = JSON.parse(payloadString);
    payload = readResult?.variables.input || readResult;
  }
  if (!payload) {
    getLogger().error(`failed to load pcwPayload`);
    throw new Error('failed to load pcwPayload');
  }
  getLogger().info(`transforming payload to robosaur format...`);

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

  getLogger().info('finished transforming payload, continue to creating projects...');
};
