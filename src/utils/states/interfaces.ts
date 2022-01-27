import { JobStatus } from '../../datasaur/get-jobs';
import { ProjectStatus } from '../../datasaur/interfaces';

export interface JobState {
  jobId: string | null;
  createdAt?: number;
  updatedAt?: number;
}

export interface CreateJobState extends JobState {
  jobStatus: JobStatus;
}

export interface ExportJobState extends JobState {
  jobStatus: JobStatus | 'PUBLISHED';
  exportedFileUrl: string;
  exportedFileUrlExpiredAt: string;
  statusOnLastExport: ProjectStatus;
}

export interface ProjectState {
  create?: CreateJobState;
  export?: ExportJobState;

  projectName: string;
  projectStatus: ProjectStatus;
  documents: Array<{ name: string }>;
  projectId: string | null | undefined;
  createdAt?: number;
  updatedAt?: number;
}
