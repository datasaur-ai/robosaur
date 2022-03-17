import { Config, StorageSources } from '../../config/interfaces';
import { PCWPayload } from './interfaces';

export const pcwTransformer = (input: Config) => {
  const { pcwPayloadSource, pcwPayload } = input.project;
  let payload: PCWPayload;
  if (pcwPayloadSource === StorageSources.INLINE) {
  }
};
