import { writeFile } from 'fs/promises';
import { Health, healthPath, HEALTH_STATUS } from './interface';

export const updateHealthStatus = async (status: HEALTH_STATUS) => {
  const timestamp = new Date();

  const healthObject: Health = {
    status,
    timestamp,
  };

  await writeFile(healthPath, Buffer.from(JSON.stringify(healthObject), 'utf-8'));
};
