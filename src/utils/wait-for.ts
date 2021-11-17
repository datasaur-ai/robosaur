import { sleep } from './sleep';

export async function waitFor<T>(test: () => Promise<T>, intervalMs: number, maxTimeoutMs: number) {
  let result: T;

  const isFalsy = (result: any) => {
    return result === undefined || result === false || result === null || result.length === 0;
  };

  do {
    result = await test();
    if (!isFalsy(result)) {
      break;
    }
    await sleep(intervalMs);
    if ((maxTimeoutMs -= intervalMs) < 0) {
      return false;
    }
  } while (isFalsy(result));
  return result;
}
