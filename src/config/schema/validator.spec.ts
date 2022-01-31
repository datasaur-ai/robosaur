import { setConfigByJSONFile } from '../config';
import { getProjectCreationValidators, getProjectExportValidators } from './validator';

const filesToBeTested = [
  'config/google-cloud-storage/config.json',
  'config/remote-files/config.json',
  'config/s3/config.json',
  'config/local/config.json',
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
