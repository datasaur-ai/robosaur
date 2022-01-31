import { getJobs, JobStatus } from '../datasaur/get-jobs';
import { getLogger } from '../logger';
import { sleep } from './sleep';

export async function pollJobsUntilCompleted(jobIds: string[], pollingTimeInMs = 5000) {
  getLogger().info(`polling jobs... `, { jobIds });
  while (true) {
    const jobs = await getJobs(jobIds);
    const unfinishedJobs = jobs.filter((j) =>
      [JobStatus.IN_PROGRESS, JobStatus.QUEUED, JobStatus.NONE].includes(j.status),
    );

    if (unfinishedJobs.length === 0) {
      getLogger().info(`all jobs have finished running`);
      return jobs;
    }

    const remainingIds = unfinishedJobs.map((j) => j.id);
    getLogger().info(`polling jobs ...`, { jobIds: remainingIds });
    await sleep(pollingTimeInMs);
  }
}
