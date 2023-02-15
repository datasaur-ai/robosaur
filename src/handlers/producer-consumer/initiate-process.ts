import { setConfigByJSONFile } from '../../config/config';
import { getDatabaseValidators } from '../../config/schema/validator';
import { initDatabase } from '../../database';
import { HEALTH_STATUS } from '../../datasaur/rex/interface';
import { getLogger } from '../../logger';
import { startUp } from './start-up';

export const initiateProcess = async (
  name: string,
  startHealthcheckServer: () => Promise<void>,
  setHealthStatus: (status: HEALTH_STATUS) => void,
  configFile: string,
) => {
  await startHealthcheckServer();
  startUp(setHealthStatus);
  setHealthStatus(HEALTH_STATUS.INITIAL);

  getLogger().info(`Begin running ${name}`, { configFile });
  setConfigByJSONFile(configFile, getDatabaseValidators());
  initDatabase();

  setHealthStatus(HEALTH_STATUS.READY);
};
