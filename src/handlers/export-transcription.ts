import { getConfig, setConfigByJSONFile } from '../config/config';
import { getExportTranscriptionValidators } from '../config/schema/validator';
import { Cabinet, getCabinets } from '../datasaur/get-cabinets';
import { Cell, getCells } from '../datasaur/get-cells';
import { getProject } from '../datasaur/get-project';
import { getProjects } from '../datasaur/get-projects';
import { Project } from '../datasaur/interfaces';
import { Role, TextDocumentKind } from '../generated/graphql';
import { getLogger } from '../logger';
import { ScriptAction } from './constants';
import * as Papa from 'papaparse';
import { publishFile } from '../utils/publish/publishFile';
import { applyExportedTag, getExportedTagId, getProjectsToExport, getTagIds } from './helpers';

export interface ResultRow {
  'Audio Call Id': string;
  'Speaker Channel': string;
  'Original Transcription': string;
  'Reviewed Transcription': string;
}

function getSpeaker(cell: Cell): string {
  const speakerMeta = cell.metadata.find((meta) => meta.key.toLowerCase() === 'speaker');
  return speakerMeta?.value ?? '';
}

async function getAllReviewerCabinets(projects: Project[]) {
  const allCabinets = new Map<string, Cabinet>();
  for (const project of projects) {
    const cabinets = await getCabinets(project.id);
    const reviewerCabinet = cabinets.find((cabinet) => cabinet.role === Role.Reviewer);
    if (reviewerCabinet) allCabinets.set(project.id, reviewerCabinet);
  }
  getLogger().info(`got ${allCabinets.size} cabinets`);
  return allCabinets;
}

async function getAllCellsFromDocuments(documentIds: string[]) {
  const allCells = new Map<string, Cell[]>();
  for (const documentId of documentIds) {
    const cells = await getCells(documentId);
    allCells.set(documentId, cells);
    getLogger().info(`got ${cells.length} cells from document ${documentId}`);
  }
  return allCells;
}

async function handleStateless() {
  const config = getConfig().exportTranscription;
  const { teamId, projectId, exportedTag, projectFilter, statusFilter } = config;
  const filterTagIds = projectFilter && projectFilter.tags ? await getTagIds(teamId, projectFilter.tags) : undefined;
  const filter = {
    statuses: statusFilter,
    teamId,
    kinds: [TextDocumentKind.TokenBased],
    daysCreatedRange: projectFilter?.date
      ? {
          newestDate: projectFilter.date.newestDate,
          oldestDate: projectFilter.date?.oldestDate,
        }
      : undefined,
    tags: filterTagIds,
    keyword: projectFilter?.keyword,
  };
  const exportedTagId = await getExportedTagId(teamId, exportedTag);

  getLogger().info('retrieving projects with filters', { filter });
  const projects = projectId
    ? [await getProject(projectId)]
    : getProjectsToExport(await getProjects(filter), exportedTagId);

  getLogger().info('retrieving all cabinets');
  const allCabinetsByProjectId = await getAllReviewerCabinets(projects);

  const allDocumentIds: string[] = [];
  const filenameByDocumentId = new Map<string, string>();

  for (const cabinet of allCabinetsByProjectId.values()) {
    for (const document of cabinet.documents) {
      allDocumentIds.push(document.id);
      filenameByDocumentId.set(document.id, document.fileName);
    }
  }

  const allCells = await getAllCellsFromDocuments(allDocumentIds);

  const resultPerDocument = new Map<string, ResultRow[]>();
  for (const documentId of allDocumentIds) {
    const cells = allCells.get(documentId);
    const fileName = filenameByDocumentId.get(documentId)!;
    const [audioCallId] = fileName.split('.');

    const documentResult: ResultRow[] = cells!.map((cell) => {
      const speakerChannel = getSpeaker(cell);
      const reviewedTranscript = cell.content;
      const originalTranscript = cell.originCell?.content ?? '';
      return {
        'Audio Call Id': audioCallId,
        'Speaker Channel': speakerChannel,
        'Original Transcription': originalTranscript,
        'Reviewed Transcription': reviewedTranscript,
      };
    });

    resultPerDocument.set(documentId, documentResult);
  }

  getLogger().info(`generating ${resultPerDocument.size} csv files`);

  // write result
  for (const resultRow of resultPerDocument.values()) {
    // write result to file
    const [firstData] = resultRow;
    if (!firstData) continue;
    const csvData = Papa.unparse(resultRow);
    await publishFile(firstData['Audio Call Id'], csvData, config);
  }

  for (const project of projects) {
    await applyExportedTag(project, exportedTagId);
  }
}

export async function handleExportTranscription(configFile: string) {
  setConfigByJSONFile(configFile, getExportTranscriptionValidators(), ScriptAction.EXPORT_TRANSCRIPTION);
  getLogger().info('executing export transcription data using filter from config');
  return handleStateless();
}
