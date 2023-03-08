import { schedule, validate, ScheduleOptions } from 'node-cron';
import { getLogger } from '../../logger';

export abstract class BaseCron {
  constructor(protected readonly expr: string) {
    const isExpressionValid = validate(expr);
    if (!isExpressionValid) {
      throw new Error('invalid cron expression');
    }
  }

  protected abstract onRun: () => Promise<void> | void;

  private _wrappedOnRun = async () => {
    try {
      await Promise.resolve(this.onRun());
    } catch (err) {
      getLogger().error(`CronERR: ${err.message}`, { stack: err.stack });
    }
  };

  async run() {
    schedule(this.expr, this._wrappedOnRun, this.getOptions()).start();
  }

  private getOptions(): ScheduleOptions {
    return {};
  }
}
