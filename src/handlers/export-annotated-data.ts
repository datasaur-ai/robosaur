import { getActiveTeamId, getConfig, setConfigByJSONFile } from '../config/config';
import { getExportAnnotatedDataValidators } from '../config/schema/validator';
import { exportProject } from '../datasaur/export-project';
import { JobStatus } from '../datasaur/get-jobs';
import { getProjects } from '../datasaur/get-projects';
import { getTeamTags } from '../datasaur/get-team-tags';
import {
  CabinetLabelSet,
  CellMetadata,
  ExportFormat,
  ExportResult,
  JSONAdvancedFormat,
  LabelEntityType,
  LabelItem,
  SpanLabel,
} from '../datasaur/interfaces';
import { getLogger } from '../logger';
import { pollJobsUntilCompleted } from '../utils/polling.helper';
import { downloadFromPreSignedUrl } from '../utils/publish/helper';
import { streamToBuffer } from '../utils/stream/streamToBuffer';
import { ScriptAction } from './constants';
import Zip from 'adm-zip';
import * as Papa from 'papaparse';
import { publishAnnotatedDataFile } from '../utils/publish/publishAnnotatedDataFile';
import path from 'path';
import { getTeamMembers, TeamMember } from '../datasaur/get-team-members';
import { keyBy } from 'lodash';
import { getCabinetLabelSetsById } from '../datasaur/get-cabinet-label-sets';

interface AnnotatedDataRow {
  Project: string;
  'Audio File ID': string;
  'Label Category': string;
  'Label Name': string;
  'Turn ID': string;
  'Start Timestamp of Turn': string;
  'End Timestamp of Turn': string;
  'Start TimeLabel': string;
  'End TimeLabel': string;
  'Labeled Phrases': string;
  'Speaker Channel': string;
  Labeler: string;
  Reviewer: string;
  Status: string;
  'Date of Labeling': string;
  'Date of Reviewing': string;
  'Date of Assignment': string;
}

interface Line {
  id: number;
  content: string;
  speaker: string;
  tokens: string[];
  labelsMap: Map<string, SpanLabel>;
  startTimestampOfTurn?: number;
  endTimestampOfTurn?: number;
}

const handleStateless = async () => {
  const exportFormat = ExportFormat.JSON_ADVANCED;
  const { statusFilter, teamId, source, projectFilter } = getConfig().exportAnnotatedData;
  const filterTagIds = projectFilter && projectFilter.tags ? await getTagIds(teamId, projectFilter.tags) : undefined;
  const teamMembers = await getTeamMembers(getActiveTeamId());
  const teamMembersMap = keyBy(teamMembers, (member: TeamMember) => member.user?.id);

  const filter = {
    statuses: statusFilter,
    teamId,
    kinds: ['TOKEN_BASED'],
    daysCreatedRange: projectFilter?.date
      ? {
          newestDate: projectFilter.date.newestDate,
          oldestDate: projectFilter.date?.oldestDate,
        }
      : undefined,
    tags: filterTagIds,
    keyword: projectFilter?.keyword,
  };
  getLogger().info('retrieving projects with filters', { filter });
  const projectToExports = await getProjects(filter);

  getLogger().info(`found ${projectToExports.length} projects to export`);

  getLogger().info(projectToExports.map((project) => project.name + '_' + project.id));

  const results: Array<{ projectName: string; exportId: string; jobStatus: JobStatus | 'PUBLISHED' }> = [];
  for (const project of projectToExports) {
    const labelSets: CabinetLabelSet[] = project.reviewCabinet
      ? await getCabinetLabelSetsById(project.reviewCabinet?.id)
      : [];
    const cabinetLabelSetsMapByIndex: { [id: number]: CabinetLabelSet } = keyBy(labelSets, 'index');
    getLogger().info(cabinetLabelSetsMapByIndex);

    const filename = `${project.name}_${project.id}`;
    const result: {
      projectName: string;
      jobStatus: JobStatus | 'PUBLISHED';
      exportId: string;
    } = {
      projectName: filename,
      jobStatus: JobStatus.NONE,
      exportId: '',
    };

    getLogger().info('submitting export job to Datasaur...', {
      create: {
        id: project.id,
        name: filename,
        format: exportFormat,
      },
    });
    let retval: ExportResult | null = null;
    try {
      retval = await exportProject(project.id, filename, exportFormat);
    } catch (error) {
      retval = {
        exportId: 'dummyexport',
        fileUrl: 'dummyfile',
      } as ExportResult;
      getLogger().error(`fail in exportProject query`, { error: JSON.stringify(error), message: error.message });
    }
    result.exportId = retval.exportId;
    result.jobStatus = retval.queued ? JobStatus.QUEUED : JobStatus.IN_PROGRESS;

    const jobResult = (await pollJobsUntilCompleted([retval.exportId]))[0];
    getLogger().info(`export job finished`, { ...jobResult });
    result.jobStatus = jobResult?.status;

    try {
      const annotatedDataCsv = await getAnnotatedData(
        retval.fileUrl,
        project.name,
        teamMembersMap,
        cabinetLabelSetsMapByIndex,
      );
      await publishAnnotatedDataFile(filename, annotatedDataCsv);
      result.jobStatus = 'PUBLISHED';
    } catch (error) {
      getLogger().error(`fail to publish exported project to ${source}`, {
        error: JSON.stringify(error),
        message: error.message,
      });
    }
    results.push(result);
  }

  const exportOK = results.filter((r) => r.jobStatus === 'PUBLISHED' || r.jobStatus === JobStatus.DELIVERED);
  const exportFail = results.filter((r) => !(r.jobStatus === 'PUBLISHED' || r.jobStatus === JobStatus.DELIVERED));
  getLogger().info(
    `completed ${results.length} export jobs; ${exportOK.length} successful and ${exportFail.length} failed`,
    {
      success: exportOK,
      fail: exportFail,
    },
  );
  getLogger().info('exiting script...');
};

async function getAnnotatedData(
  url: string,
  projectName: string,
  teamMembersMap: { [id: string]: TeamMember },
  cabinetLabelSetsMapByIndex: { [id: number]: CabinetLabelSet },
): Promise<string> {
  const zipStream = await downloadFromPreSignedUrl(url);
  const zip = new Zip(await streamToBuffer(zipStream.data));
  let annotatedDataRows: AnnotatedDataRow[] = [];

  for (const entry of zip.getEntries()) {
    if (!entry.isDirectory) {
      if (entry.entryName.includes('/DOCUMENT-')) {
        const filename = path.parse(entry.entryName).name;
        const jsonAdvanced: JSONAdvancedFormat = JSON.parse(zip.readAsText(entry));
        const rows = getAnnotatedDataRows(
          jsonAdvanced,
          projectName,
          filename,
          teamMembersMap,
          cabinetLabelSetsMapByIndex,
        );
        annotatedDataRows = annotatedDataRows.concat(rows);
      }
    }
  }

  return Papa.unparse(annotatedDataRows);
}

function getAnnotatedDataRows(
  jsonAdvanced: JSONAdvancedFormat,
  projectName: string,
  filename: string,
  teamMembersMap: { [id: string]: TeamMember },
  cabinetLabelSetsMapByIndex: { [id: number]: CabinetLabelSet },
): AnnotatedDataRow[] {
  if (
    !jsonAdvanced.labels ||
    jsonAdvanced.labels.length == 0 ||
    !jsonAdvanced.labelSets ||
    jsonAdvanced.labelSets.length == 0
  ) {
    return [];
  }

  const linesMap = new Map<number, Line>();

  const labelSetsMap = new Map<number, { [id: number]: LabelItem }>();

  for (const labelSet of jsonAdvanced.labelSets) {
    const labelItemMap = keyBy(labelSet.labelItems, 'id');
    labelSetsMap.set(labelSet.index, labelItemMap);
  }

  for (const sentence of jsonAdvanced.sentences) {
    const line = {
      id: sentence.id,
      content: sentence.content,
      speaker: getSpeakerFromMetadata(sentence.metadata),
      tokens: sentence.tokens,
      labelsMap: new Map<string, SpanLabel>(),
    };
    linesMap.set(sentence.id, line);
  }

  for (const spanLabel of jsonAdvanced.labels) {
    const line = linesMap.get(spanLabel.startCellLine);
    if (line) {
      if (spanLabel.type == LabelEntityType.TIMESTAMP) {
        if (isStartTimestampofTurn(spanLabel)) {
          line.startTimestampOfTurn = spanLabel.startTimestampMillis;
        }
        if (isEndTimestampofTurn(spanLabel, line.tokens)) {
          line.endTimestampOfTurn = spanLabel.endTimestampMillis;
        }
      }

      const positionHashCode = getPositionHashCode(spanLabel.hashCode);
      const label = line.labelsMap.get(positionHashCode);
      if (label) {
        if (spanLabel.type == LabelEntityType.SPAN) {
          label.labelSetItemId = spanLabel.labelSetItemId;
          label.acceptedByUserId = spanLabel.acceptedByUserId;
          label.rejectedByUserId = spanLabel.rejectedByUserId;
          label.status = spanLabel.status;
          label.createdAt = spanLabel.createdAt;
          label.updatedAt = spanLabel.updatedAt;
        } else if (spanLabel.type == LabelEntityType.TIMESTAMP) {
          label.startTimestampMillis = spanLabel.startTimestampMillis;
          label.endTimestampMillis = spanLabel.endTimestampMillis;
        }
        line.labelsMap.set(positionHashCode, label);
      } else {
        line.labelsMap.set(positionHashCode, spanLabel);
      }
    }
  }

  return linesMapToAnnotatedDataRows(
    linesMap,
    projectName,
    filename,
    teamMembersMap,
    labelSetsMap,
    cabinetLabelSetsMapByIndex,
  );
}

function isStartTimestampofTurn(label: SpanLabel): boolean {
  return label.startTokenIndex == 0 && label.startCharIndex == 0;
}

function isEndTimestampofTurn(label: SpanLabel, tokens: string[]): boolean {
  return label.endTokenIndex == tokens.length - 1 && label.endCharIndex == tokens[tokens.length - 1].length - 1;
}

function getSpeakerFromMetadata(metadata?: CellMetadata[]): string {
  let speaker = '';
  if (metadata) {
    const speakerMeta = metadata.find((item) => item.key === 'speaker');
    if (speakerMeta) {
      speaker = speakerMeta.value;
    }
  }
  return speaker;
}

function linesMapToAnnotatedDataRows(
  linesMap: Map<number, Line>,
  projectName: string,
  filename: string,
  teamMembersMap: { [id: string]: TeamMember },
  labelSetsMap: Map<number, { [id: number]: LabelItem }>,
  cabinetLabelSetsMapByIndex: { [id: number]: CabinetLabelSet },
): AnnotatedDataRow[] {
  const annotatedDataRows: AnnotatedDataRow[] = [];

  for (const lineId of linesMap.keys()) {
    const line = linesMap.get(lineId)!;
    for (const key of line.labelsMap.keys()) {
      const label = line.labelsMap.get(key)!;

      const annotatedDataRow: AnnotatedDataRow = {
        Project: projectName,
        'Audio File ID': filename,
        'Label Category': getLabelCategory(cabinetLabelSetsMapByIndex, label.layer),
        'Label Name': getLabelName(labelSetsMap, label),
        'Turn ID': String(label.startCellLine + 1),
        'Start Timestamp of Turn': timestampMilisToTime(line.startTimestampOfTurn),
        'End Timestamp of Turn': timestampMilisToTime(line.endTimestampOfTurn),
        'Start TimeLabel': timestampMilisToTime(label.startTimestampMillis),
        'End TimeLabel': timestampMilisToTime(label.endTimestampMillis),
        'Labeled Phrases': getLabeledPhrases(label, line.tokens),
        'Speaker Channel': line.speaker,
        Labeler: getUserEmail(teamMembersMap, label.labeledByUserId),
        Reviewer: getReviewer(label, teamMembersMap),
        Status: label.status,
        'Date of Labeling': label.createdAt,
        'Date of Reviewing': label.updatedAt,
        'Date of Assignment': '',
      };

      annotatedDataRows.push(annotatedDataRow);
    }
  }

  return annotatedDataRows;
}

function getLabelCategory(cabinetLabelSetsMapByIndex: { [id: number]: CabinetLabelSet }, index: number): string {
  return cabinetLabelSetsMapByIndex[index] ? cabinetLabelSetsMapByIndex[index].name : '';
}

function getLabelName(labelSetsMap: Map<number, { [id: number]: LabelItem }>, label: SpanLabel): string {
  const labelSet = labelSetsMap.get(label.layer);

  if (labelSet) {
    const labelSetItem = labelSet[label.labelSetItemId];
    if (labelSetItem) {
      return labelSetItem.labelName;
    }
  }

  return '';
}

function timestampMilisToTime(timestampMilis?: number): string {
  return timestampMilis ? new Date(timestampMilis).toISOString().slice(11, -1) : 'NA';
}

function getReviewer(label: SpanLabel, teamMembersMap: { [id: string]: TeamMember }): string {
  if (label.acceptedByUserId) {
    return getUserEmail(teamMembersMap, label.acceptedByUserId);
  } else if (label.rejectedByUserId) {
    return getUserEmail(teamMembersMap, label.rejectedByUserId);
  } else {
    return 'Consensus';
  }
}

function getUserEmail(teamMembersMap: { [id: string]: TeamMember }, userId?: number): string {
  if (userId) {
    const teamMember = teamMembersMap[String(userId)];
    if (teamMember) {
      return teamMember.user ? teamMember.user.email : '';
    }
  }

  return '';
}

function getLabeledPhrases(label: SpanLabel, tokens: string[]) {
  const labeledPhrases = tokens.slice(label.startTokenIndex, label.endTokenIndex + 1);
  labeledPhrases[0] = labeledPhrases[0].slice(label.startCharIndex);
  labeledPhrases[labeledPhrases.length - 1] = labeledPhrases[labeledPhrases.length - 1].slice(
    label.startCharIndex,
    label.endCharIndex + 1,
  );
  return labeledPhrases.join(' ');
}

function getPositionHashCode(hashCode: string): string {
  return hashCode.split(':').slice(2, -2).join(':');
}

export async function handleExportAnnotatedData(configFile: string) {
  setConfigByJSONFile(configFile, getExportAnnotatedDataValidators(), ScriptAction.EXPORT_ANNOTATED_DATA);

  getLogger().info('executing export annotated data using filter from config');
  return handleStateless();
}

async function getTagIds(teamId: string, tagsName: string[]) {
  if (tagsName.length === 0) return undefined;
  const tags = await getTeamTags(teamId);

  return tagsName.map((tagName) => {
    const tag = tags.find((tagItem) => tagItem.name === tagName);
    if (tag === undefined) {
      throw new Error(`Tag ${tagName} is not found.`);
    }
    return tag.id;
  });
}
