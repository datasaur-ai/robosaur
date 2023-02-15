import express from 'express';
import { Health, HEALTH_STATUS } from '../datasaur/rex/interface';
import { getLogger } from '../logger';

export async function createHealthcheckServer(serviceName: string) {
  const app = express();

  let healthStatus: HEALTH_STATUS = HEALTH_STATUS.INITIAL;

  const setHealthStatus = (status: HEALTH_STATUS) => {
    healthStatus = status;
  };

  const getHealthCheckBody = () => {
    const healthObject: Health = {
      status: healthStatus,
      timestamp: new Date(),
    };
    return healthObject;
  };

  app.get('/health', async (req, res) => {
    if (healthStatus === HEALTH_STATUS.STOPPED) {
      getLogger().error(`App stopped working, returning 500 response code`);
      return res.status(500).json(getHealthCheckBody());
    }

    getLogger().info('App healthy, return 200 response code');
    res.json(getHealthCheckBody());
  });

  const startApp = async () => {
    app.listen(3000, () => {
      getLogger().info('Healthcheck server run at port 3000');
    });
  };

  return {
    setHealthStatus,
    startApp,
  };
}
