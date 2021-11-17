import { gql } from 'graphql-request';
import { query } from './query';

export enum JobStatus {
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  IN_PROGRESS = 'IN_PROGRESS',
  NONE = 'NONE',
  QUEUED = 'QUEUED',
}

export interface Job {
  id: string;
  status: JobStatus;
  progress: number;
  errors: JobError[];
  resultId: string | null;
}

interface JobError {
  id: string;
  stack: string;
  args: any | null;
}

const GET_JOBS = gql`
  query GetJobs($jobIds: [String!]!) {
    result: getJobs(jobIds: $jobIds) {
      id
      status
      progress
      errors {
        id
        stack
        args
      }
      resultId
    }
  }
`;
export async function getJobs(jobIds) {
  const variables = { jobIds };
  const data = await query(GET_JOBS, variables);
  return data.result;
}
