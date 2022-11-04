export class ProjectCreationError extends Error {
  constructor(error: string) {
    super(`Error during project creation: ${error}`);
  }
}
