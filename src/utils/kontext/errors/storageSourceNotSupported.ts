import { StorageSources } from '../../../config/interfaces';

export class StorageSourceNotSupportedError extends Error {
  constructor(source: StorageSources, purpose: string) {
    super(`${source} not currently supported for ${purpose}`);
  }
}
