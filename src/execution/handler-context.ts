import { getLoggerService } from '../logger/index';
import { executionNamespace } from './execution-namespace';
import { randomUUID } from 'crypto';
import { getExecutionValue, preventNewTraceIdGeneration } from './helpers';

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
      const shouldPreventNewTraceIdGeneration = getExecutionValue('prevent-new-traceid-generation');

      let traceId;
      if (!shouldPreventNewTraceIdGeneration) {
        traceId = generateRandomTraceId();
        executionNamespace.set('trace-id', traceId);
      } else {
        traceId = getExecutionValue('trace-id');
      }

      // register resolver for logging and tracing
      getLoggerService().registerResolver(() => {
        return {
          command: commandName,
          'trace-id': traceId,
        };
      });

      // run the callback
      const result = await Promise.resolve(callback(...args));
      getLoggerService().popResolver();
      return result;
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
      preventNewTraceIdGeneration();
      executionNamespace.set('trace-id', traceId);
      return onJob(...args);
    });
  };

  return async (...args: T) => {
    const result = await Promise.resolve(consumerFn(wrappedProcessJob, ...args));
    getLoggerService().popResolver();
    return result;
  };
}
