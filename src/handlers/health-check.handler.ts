import { existsSync, readFileSync, writeFileSync } from 'fs';
import { Health, healthPath, HEALTH_STATUS } from '../datasaur/rex/interface';
import { createSimpleHandlerContext } from '../execution';
import { getLogger } from '../logger';

export const healthCheck = createSimpleHandlerContext('health-check', _healthCheck);

function _healthCheck() {
  if (!existsSync(healthPath)) {
    getLogger().error('File not exist, exiting with code 1');
    process.exit(1);
  }

  const readResult = readFileSync(healthPath).toString('utf-8');
  let healthObject: Health;
  try {
    healthObject = JSON.parse(readResult);
  } catch (e) {
    getLogger().error('File has been tempered, exiting with code 1');
    process.exit(1);
  }

  if (healthObject.status === HEALTH_STATUS.STOPPED) {
    getLogger().error('Consumer stopped working, exiting with code 1');
    process.exit(1);
  }

  healthObject.timestamp = new Date();
  writeFileSync(healthPath, Buffer.from(JSON.stringify(healthObject), 'utf-8'));

  getLogger().info('Consumer healthy, exiting with code 0');
  process.exit(0);
}
