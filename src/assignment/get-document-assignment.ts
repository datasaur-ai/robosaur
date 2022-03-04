import { assignAllDocuments } from './assign-all-documents';
import { getConfig } from '../config/config';
import { assignAutoDocuments } from './assign-auto-documents';
import { AssignmentConfig } from './interfaces';
import { Document } from '../documents/interfaces';
import { getLogger } from '../logger';

export function getDocumentAssignment(assignees: AssignmentConfig, documents: Document[]) {
  const assignmentStrategy = getConfig()?.assignment?.strategy;
  if (!assignmentStrategy) {
    getLogger().info('no assignment strategy specified, assign all documents to all labelers...')
    return assignAllDocuments(assignees, documents)
  };

  getLogger().info(`${assignmentStrategy} assignment strategy specified.`)
  if (assignmentStrategy === 'ALL') return assignAllDocuments(assignees, documents);
  else if (assignmentStrategy === 'AUTO') return assignAutoDocuments(assignees, documents);

  throw new Error(`Unsupported assignment strategy ${assignmentStrategy}`);
}
