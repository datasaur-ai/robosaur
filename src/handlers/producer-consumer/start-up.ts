import { HEALTH_STATUS } from '../../datasaur/rex/interface';

export const startUp = (setHealthStatus: (status: HEALTH_STATUS) => void) => {
  process.on('SIGINT', () => {
    console.log('Process Interrupted');
    setHealthStatus(HEALTH_STATUS.STOPPED);
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('Killing Process');
    setHealthStatus(HEALTH_STATUS.STOPPED);
    process.exit(0);
  });
};
