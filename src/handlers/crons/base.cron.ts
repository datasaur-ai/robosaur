import { schedule, validate, ScheduleOptions } from 'node-cron';

export abstract class BaseCron {
  constructor(protected readonly expr: string) {
    const isExpressionValid = validate(expr);
    if (!isExpressionValid) {
      throw new Error('invalid cron expression');
    }
  }

  protected abstract onRun: () => Promise<void> | void;

  async run() {
    schedule(this.expr, this.onRun, this.getOptions());
  }

  private getOptions(): ScheduleOptions {
    return {
      timezone: this.getTimezone(),
    };
  }

  protected getTimezone() {
    return 'Asia/Jakarta';
  }
}
