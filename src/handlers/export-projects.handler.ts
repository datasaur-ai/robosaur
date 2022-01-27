import { setConfigByJSONFile } from '../config/config';
import { getProjectExportValidators } from '../config/schema/validator';

export async function handleExportProjects(configFile: string) {
  // set config
  setConfigByJSONFile(configFile, getProjectExportValidators());
  // get state
  // get export filter
  // get projects with filter
  // export matched projects
  //  // retrieve from datasaur
  // // wait
  //  // upload to destined bucket
  // update state along the way
  // summarize what the script did in this run (success/fail count)
}
