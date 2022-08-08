export function isVersionGreaterThanOrEqual(v1: string, v2: string) {
  const v1List = v1.split('.').map((e: string) => parseInt(e, 10));
  const v2List = v2.split('.').map((e: string) => parseInt(e, 10));

  for (const i in v1List) {
    v2List[i] = v2List[i] || 0;
    if (v1List[i] === v2List[i]) {
      continue;
    } else if (v1List[i] > v2List[i]) {
      return true;
    } else {
      return false;
    }
  }
  return v2List.length > v1List.length ? false : true;
}
