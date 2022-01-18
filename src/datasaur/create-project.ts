import { gql } from 'graphql-request';
import { DocumentAssignment } from '../assignment/interfaces';
import { Document } from '../documents/interfaces';
import { query } from './query';
import { EXTENSIONS } from './constants';
import { createLabelSet } from './create-label-set';
import { Config } from '../config/interfaces';

const CREATE_PROJECT_MUTATION = gql`
  mutation LaunchTextProjectAsyncMutation($input: LaunchTextProjectInput!) {
    result: launchTextProjectAsync(input: $input) {
      job {
        id
      }
      name
    }
  }
`;

export async function createProject(
  name: string,
  documents: Document[],
  documentAssignments: DocumentAssignment[],
  settings: Config['project'],
  tagNames: string[] = [],
) {
  const projectDocuments = documents.map((document) => {
    return {
      ...document,
      customScriptId: settings.documentSettings.customScriptId ?? undefined,
      docFileOptions: { firstRowAsHeader: settings.documentSettings?.firstRowAsHeader },
    };
  });

  projectDocuments[0]['settings'] = { questions: settings.questions };

  let labelSetIDs: string[] | null = null;
  if (settings.documentSettings.kind === 'TOKEN_BASED' && settings.labelSets) {
    labelSetIDs = await Promise.all(
      settings.labelSets.map(async (labelSet, index) => {
        if (labelSet) {
          console.log(`Uploading label set "${labelSet.label}" for index: ${index}...`);
          const result = await createLabelSet(labelSet.label, index, labelSet.config.options);
          return result.id;
        }
        return null;
      }),
    );
  }

  const variables = {
    input: {
      name,
      teamId: settings.teamId,
      documentSettings: settings.documentSettings,
      projectSettings: settings.projectSettings,
      documentAssignments,
      tagNames,
      documents: projectDocuments,
      labelerExtensions: EXTENSIONS[settings.documentSettings.kind].LABELER,
      reviewerExtensions: EXTENSIONS[settings.documentSettings.kind].REVIEWER,
      labelSetIDs,
    },
  };

  const data = await query(CREATE_PROJECT_MUTATION, variables);
  return data.result;
}
