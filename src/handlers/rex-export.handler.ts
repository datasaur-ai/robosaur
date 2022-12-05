import { handleExportProjects } from "./export-projects.handler";
import { BasePayload } from "../database/entities/base-payload.entity";

export async function handleExport(
  configFile: string,
  _data: BasePayload,
  errorCallback: (error: Error) => Promise<void>
) {
  // TODO: implement post processing and delete the exported file
  await handleExportProjects(
    configFile,
    { unzip: true, deleteProjectAfterExport: true },
    errorCallback
  );
}
