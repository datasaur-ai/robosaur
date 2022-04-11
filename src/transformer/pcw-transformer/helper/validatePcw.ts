import { PCWSource } from '../../../config/interfaces';
import { getLogger } from '../../../logger';
import { PcwPayloadNotProvided } from '../error/pcw-payload-not-provided.error';
import { PCWWrapper, PCWPayload } from '../interfaces';

export const validatePcw = (
  pcwPayloadSource: PCWSource | undefined,
  pcwPayload: string | (PCWWrapper & PCWPayload) | undefined,
) => {
  if (!pcwPayloadSource) {
    getLogger().error('usePcw is true but pcwPayloadSource is not provided, please provide pcwPayloadSource');
    throw new PcwPayloadNotProvided();
  }
  if (!pcwPayload) {
    getLogger().error('usePcw is true but pcwPayload is not provided, please provide pcwPayload');
    throw new PcwPayloadNotProvided();
  }
};
