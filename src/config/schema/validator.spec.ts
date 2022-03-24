import { setConfigByJSONFile } from '../config';
import { getProjectCreationValidators, getProjectExportValidators } from './validator';

const filesToBeTested = [
  'sample/storage/google-cloud-storage/config.json',
  'sample/storage/remote-files/config.json',
  'sample/storage/s3/config.json',
  'sample/storage/local/config.json',
  'quickstart/token-based/config/config.json',
];

describe.each([
  [getProjectExportValidators.name, getProjectExportValidators()],
  [getProjectCreationValidators.name, getProjectCreationValidators()],
])('%s', (_fname, validateFunctions) => {
  it.each(filesToBeTested.map((f) => [f]))(
    'sample file %s should pass assignment validation',
    (configFilePath: string) => {
      expect(() => setConfigByJSONFile(configFilePath, validateFunctions)).not.toThrow();
    },
  );
});
