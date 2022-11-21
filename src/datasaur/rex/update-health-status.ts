import { writeFileSync } from 'fs';
import { Health, healthPath, HEALTH_STATUS } from './interface';

export const updateHealthStatus = (status: HEALTH_STATUS) => {
  const timestamp = new Date();

  const healthObject: Health = {
    status,
    timestamp,
  };

  writeFileSync(healthPath, Buffer.from(JSON.stringify(healthObject), 'utf-8'));
};
