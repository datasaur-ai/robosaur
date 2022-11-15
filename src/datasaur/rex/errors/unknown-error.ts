export class UnknownError extends Error {
  constructor(error: Error) {
    super(`Unrecognized Error. Here's the error stack trace: ${error}`);
  }
}
