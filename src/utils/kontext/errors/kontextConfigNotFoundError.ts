export class KontextConfigNotFoundError extends Error {
  constructor() {
    super('--from-zip option is given but Kontext config not found');
  }
}
