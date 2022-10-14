import { gql } from 'graphql-request';
import { DocumentAssignment } from '../assignment/interfaces';
import { Document } from '../documents/interfaces';
import { query } from './query';
import { EXTENSIONS } from './constants';
import { createLabelSet } from './create-label-set';
import { Config } from '../config/interfaces';
import { getLogger } from '../logger';
import { getExtensions } from './utils/get-extensions';

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
  settings: Config['create'],
) {
  const projectDocuments = documents.map((document) => {
    return {
      ...document,
      fileTransformerId: settings.documentSettings.fileTransformerId ?? undefined,
      customTextExtractionAPIId: settings.documentSettings.customTextExtractionAPIId,
      docFileOptions: {
        ...settings.docFileOptions,
        firstRowAsHeader: settings?.docFileOptions?.firstRowAsHeader ?? !!settings.documentSettings?.firstRowAsHeader,
      },
    };
  });

  projectDocuments[0]['settings'] = { questions: settings.questions };

  let labelSetIDs: string[] | null = null;
  if (
    (settings.documentSettings.kind === 'TOKEN_BASED' || settings.kinds?.includes('TOKEN_BASED')) &&
    settings.labelSets
  ) {
    labelSetIDs = await Promise.all(
      settings.labelSets.map(async (labelSet, index) => {
        if (labelSet) {
          getLogger().info(`uploading label set "${labelSet.label}" for index: ${index}...`);
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
      type: settings.type,
      kinds: settings.kinds,
      projectSettings: settings.projectSettings,
      documentAssignments,
      tagNames: settings.tagNames,
      documents: projectDocuments,
      labelerExtensions: settings.kinds
        ? getExtensions(settings.kinds || []).LABELER
        : EXTENSIONS[settings.documentSettings.kind || 'TOKEN_BASED'].LABELER,
      reviewerExtensions: settings.kinds
        ? getExtensions(settings.kinds || []).REVIEWER
        : EXTENSIONS[settings.documentSettings.kind || 'TOKEN_BASED'].REVIEWER,
      labelSetIDs,
      splitDocumentOption: settings.splitDocumentOption,
    },
  };

  const data = await query(CREATE_PROJECT_MUTATION, variables);
  return data.result;
}
