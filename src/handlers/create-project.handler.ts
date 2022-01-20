import { resolve } from 'path';
import { assignAllDocuments } from '../assignment/assign-all-documents';
import { getAssignmentConfig } from '../assignment/get-assignment-config';
import { getConfig, setConfigByJSONFile } from '../config/config';
import { createProject } from '../datasaur/create-project';
import { getJobs, JobStatus } from '../datasaur/get-jobs';
import { getDocuments } from '../documents/get-documents';
import { getLogger } from '../logger';
import { getLabelSetsFromDirectory } from '../utils/labelset';
import { sleep } from '../utils/sleep';

export async function handleCreateProject(projectName: string, configFile: string) {
  const cwd = process.cwd();
  setConfigByJSONFile(resolve(cwd, configFile));

  const projectSetting = getConfig().project;
  const documents = getDocuments();
  const assignmentPool = await getAssignmentConfig();

  const assignments = assignAllDocuments(assignmentPool, documents);

  projectSetting.labelSets = getLabelSetsFromDirectory(getConfig());

  const result = await createProject(projectName, documents, assignments, projectSetting);
  while (true) {
    await sleep(5000);
    const jobs = await getJobs([result.job.id]);
    const notFinishedStatuses = [JobStatus.IN_PROGRESS, JobStatus.NONE, JobStatus.QUEUED];
    const notFinishedJobs = jobs.filter((job) => notFinishedStatuses.includes(job.status));
    if (notFinishedJobs.length === 0) {
      getLogger().info(JSON.stringify(jobs[0]));
      break;
    }
  }
}
