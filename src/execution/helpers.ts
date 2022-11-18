import { executionNamespace } from './execution-namespace';

export function getExecutionValue<T>(key: string) {
  return executionNamespace.get(key) as T;
}

export function preventNewTraceIdGeneration() {
  executionNamespace.set('prevent-new-traceid-generation', true);
}
