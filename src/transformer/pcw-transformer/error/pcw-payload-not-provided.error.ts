export class PcwPayloadNotProvided extends Error {
  constructor() {
    super('usePcw is true but pcwPayload or pcwPayloadSource is not provided, please provide the required options');
    this.name = 'PcwPayloadNotProvided';
  }
}
