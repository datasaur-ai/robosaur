import { DatasaurVersion } from '../constants';

export function parseVersion(version) {
  const versionValues = getVersionValues().sort((v1, v2) => v1.localeCompare(v2, undefined, { numeric: true }));
  for (const value of versionValues) {
    if (value.localeCompare(version, undefined, { numeric: true }) != -1) {
      return value;
    }
  }
  return DatasaurVersion.DEFAULT;
}

export function getVersionValues() {
  return Object.values(DatasaurVersion).filter((value) => {
    return value != DatasaurVersion.DEFAULT;
  });
}
