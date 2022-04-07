import { PCWSource, StorageSources } from '../../../config/interfaces';
import { getLogger } from '../../../logger';
import { getStorageClient } from '../../../utils/object-storage';
import { ObjectStorageClient } from '../../../utils/object-storage/interfaces';
import { readJSONFile } from '../../../utils/readJSONFile';
import { WrongPcwPayloadType } from '../error/wrong-pcw-payload-type.error';
import { PCWPayload, PCWWrapper } from '../interfaces';

const getFromInline = (pcwPayload: string | (PCWWrapper & PCWPayload)) => {
  if (typeof pcwPayload === 'string') {
    getLogger().error('pcwPayloadSource is "inline" but pcwPayload is given a string');
    throw new WrongPcwPayloadType('INLINE', 'string');
  }

  return pcwPayload?.variables.input || pcwPayload;
};

const getFromLocal = (pcwPayloadSource: PCWSource, pcwPayload: string | (PCWWrapper & PCWPayload)) => {
  getLogger().info(`retrieving folders in local directory ${pcwPayload} `);
  if (typeof pcwPayload !== 'string') {
    getLogger().error(`pcwPayloadSource is ${pcwPayloadSource?.source} but pcwPayload is not given a string`);
    throw new WrongPcwPayloadType(pcwPayloadSource?.source, 'NOT string');
  }
  const readResult = readJSONFile(pcwPayload);
  return readResult?.variables.input || readResult;
};

const getFromCloud = async (pcwPayloadSource: PCWSource, pcwPayload: string | (PCWWrapper & PCWPayload)) => {
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
  return readResult?.variables.input || readResult;
};

export const parsePcw = async (pcwPayloadSource: PCWSource, pcwPayload: string | (PCWWrapper & PCWPayload)) => {
  if (pcwPayloadSource?.source === StorageSources.INLINE) {
    return getFromInline(pcwPayload);
  } else if (pcwPayloadSource?.source === StorageSources.LOCAL) {
    return getFromLocal(pcwPayloadSource, pcwPayload);
  } else {
    return getFromCloud(pcwPayloadSource, pcwPayload);
  }
};
