export class ExportProjectError extends Error {
  constructor(error: string) {
    super(`Error during exporting project: ${error}`);
  }
}
