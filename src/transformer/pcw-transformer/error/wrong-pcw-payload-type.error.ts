export class WrongPcwPayloadType extends Error {
  constructor(sourceType: string, given: string) {
    super(`pcwPayloadSource is ${sourceType} but pcwPayload is of type ${given}`);
    this.name = 'WrongPcwPayloadType';
  }
}
