import { Config, PCWSource } from '../../../config/interfaces';
import { getLogger } from '../../../logger';
import { PcwPayloadNotProvided } from '../error/pcw-payload-not-provided.error';
import { PCWPayload, PCWWrapper } from '../interfaces';

export const pcwTransformerValidator = (
  input: Config['project'],
): { pcwPayloadSource: PCWSource; pcwPayload: string | (PCWWrapper & PCWPayload) } => {
  const { pcwPayloadSource, pcwPayload } = input;
  if (!pcwPayloadSource) {
    getLogger().error('usePcw is true but pcwPayloadSource is not provided, please provide pcwPayloadSource');
    throw new PcwPayloadNotProvided();
  }
  if (!pcwPayload) {
    getLogger().error('usePcw is true but pcwPayload is not provided, please provide pcwPayload');
    throw new PcwPayloadNotProvided();
  }
  return { pcwPayloadSource, pcwPayload };
};
