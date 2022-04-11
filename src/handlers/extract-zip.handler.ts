import { resolve } from 'path';
import { getConfig, setConfigByJSONFile } from '../config/config';
import { handleFromZip } from '../utils/kontext/handleFromZip';

export const handleExtractZip = async (configFile: string) => {
  const cwd = process.cwd();
  setConfigByJSONFile(resolve(cwd, configFile));

  const kontextConfig = getConfig().documents.kontext;
  if (kontextConfig) {
    handleFromZip(getConfig().documents);
  }
};
