export class JobCanceledError extends Error {
  constructor(job: number) {
    super(`Job ${job} is cancelled by client`);
  }
}
