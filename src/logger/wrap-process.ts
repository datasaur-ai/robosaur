import { getLoggerService, loggerNamespace } from './index';

export interface ProcessWrapper {
  (onRun: () => void | Promise<void>);
}

export function createResolver(key: string) {
  return () => {
    const resolved = loggerNamespace.get(key);
    if (resolved === null || resolved === undefined) throw new Error(`Cannot get ${key} from loggerNamespace`);
    return {
      [key]: resolved,
    };
  };
}

export function createProcessWrapper<T>(key: string) {
  getLoggerService().registerResolver(createResolver(key));
  return async function (contextResolver: () => T | Promise<T>, onRun: () => void | Promise<void>) {
    return loggerNamespace.runPromise(async () => {
      const context = await contextResolver();
      loggerNamespace.set(key, context);
      await Promise.resolve(onRun());
    });
  };
}
