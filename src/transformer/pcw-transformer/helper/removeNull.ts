export function removeNulls(obj: any): any {
  if (obj === null) {
    return undefined;
  }
  if (typeof obj === 'object') {
    for (let key in obj) {
      obj[key] = removeNulls(obj[key]);
    }
  }
  return obj;
}
