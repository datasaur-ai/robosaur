export class DeleteProjectError extends Error {
  constructor(error: string) {
    super(`Error during deleting project: ${error}`);
  }
}
