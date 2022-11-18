import { getLoggerService } from '../logger/index';
import { executionNamespace } from './execution-namespace';
import { randomUUID } from 'crypto';
import { getExecutionValue } from './helpers';

export interface HandlerContextCallback<T extends unknown[]> {
  (...args: T): void | Promise<void>;
}

export function generateRandomTraceId() {
  return randomUUID();
}

export function createSimpleHandlerContext<T extends unknown[]>(
  commandName: string,
  callback: HandlerContextCallback<T>,
): HandlerContextCallback<T> {
  return function (...args) {
    return executionNamespace.runAndReturn(async () => {
      // generate random traceId
      const traceId = generateRandomTraceId();
      executionNamespace.set('traceId', traceId);

      // register resolver for logging and tracing
      getLoggerService().registerResolver(() => {
        return {
          command: commandName,
          'trace-id': traceId,
        };
      });

      // run the callback
      return callback(...args);
    });
  };
}

export interface ProcessJob<T extends unknown[]> {
  (traceId: string, ...args: T): Promise<void>;
}

export interface ConsumerFn<T extends unknown[], U extends unknown[]> {
  (processJob: ProcessJob<U>, ...args: T);
}

export function createConsumerHandlerContext<T extends unknown[], U extends unknown[]>(
  commandName: string,
  consumerFn: ConsumerFn<T, U>,
  onJob: HandlerContextCallback<U>,
) {
  getLoggerService().registerResolver(() => {
    const traceId = getExecutionValue('trace-id');
    return {
      'trace-id': traceId,
      command: commandName,
    };
  });

  const wrappedProcessJob = (traceId: string, ...args: U) => {
    return executionNamespace.runAndReturn(async () => {
      executionNamespace.set('trace-id', traceId);
      return onJob(...args);
    });
  };

  return async (...args: T) => consumerFn(wrappedProcessJob, ...args);
}
