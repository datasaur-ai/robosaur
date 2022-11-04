export class AutoLabelError extends Error {
  constructor(jobError: string) {
    super(`ML-Assisted labeling API throws error: ${jobError}`);
  }
}
