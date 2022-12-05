import { setConfigByJSONFile } from "../config/config";
import { getDatabaseValidators } from "../config/schema/validator";
import { initDatabase } from "../database";
import { HEALTH_STATUS, SI_TEAM_ID } from "../datasaur/rex/interface";
import { orchestrateJob } from "../datasaur/rex/orchestrate-job";
import { updateHealthStatus } from "../datasaur/rex/update-health-status";
import { startConsumer } from "../datasaur/start-consumer";
import { createConsumerHandlerContext, ProcessJob } from "../execution";
import { getLogger } from "../logger";

const startUp = () => {
  process.on("SIGINT", () => {
    console.log("Process Interrupted");
    updateHealthStatus(HEALTH_STATUS.STOPPED);
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("Killing Process");
    updateHealthStatus(HEALTH_STATUS.STOPPED);
    process.exit(0);
  });
};

export const handleStartConsumer = createConsumerHandlerContext(
  "start-consumer",
  _handleStartConsumer,
  orchestrateJob
);

export async function _handleStartConsumer(
  processJob: ProcessJob<unknown[]>,
  configFile: string
) {
  try {
    startUp();
    updateHealthStatus(HEALTH_STATUS.INITIAL);

    getLogger().info("Begin running consumer", { configFile });
    setConfigByJSONFile(configFile, getDatabaseValidators());
    initDatabase();

    updateHealthStatus(HEALTH_STATUS.READY);

    const teamId = process.env.TEAM_ID;
    if (!teamId) {
      getLogger().error("Team Id not found in environment variables");
      return;
    }

    await startConsumer(processJob, Number.parseInt(teamId));
  } catch (e) {
    updateHealthStatus(HEALTH_STATUS.STOPPED);
  } finally {
    updateHealthStatus(HEALTH_STATUS.STOPPED);
  }
}
