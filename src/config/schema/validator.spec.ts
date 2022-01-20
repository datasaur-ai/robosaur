import { setConfigByJSONFile, getConfig } from '../config';
import { validateConfigAssignment, validateConfigDocuments } from './validator';

describe(validateConfigAssignment.name, () => {
  it.each([
    ['config/google-cloud-storage/config.json'],
    ['config/remote-files/config.json'],
    ['config/google-cloud-storage/config.json'],
  ])('sample file %s should pass assignment validation', (configFilePath: string) => {
    setConfigByJSONFile(configFilePath);
    expect(() => validateConfigAssignment(getConfig())).not.toThrow();
  });
});

describe(validateConfigDocuments.name, () => {
  it.each([
    ['config/google-cloud-storage/config.json'],
    ['config/remote-files/config.json'],
    ['config/google-cloud-storage/config.json'],
  ])('sample file %s should pass documents validation', (configFilePath: string) => {
    setConfigByJSONFile(configFilePath);
    expect(() => validateConfigDocuments(getConfig())).not.toThrow();
  });
});