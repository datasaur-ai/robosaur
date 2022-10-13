import chunk from 'lodash/chunk';
import { unparse } from 'papaparse';
import { getConfig, setConfigByJSONFile } from '../../config/config';
import { StateConfig } from '../../config/interfaces';
import { getProjectExportValidators } from '../../config/schema/validator';
import { getProjects } from '../../datasaur/get-projects';
import { Project, ProjectFinalReport, RowFinalReport } from '../../generated/graphql';
import { getLogger } from '../../logger';
import { publishFile } from '../../utils/publish/publishFile';
import { ScriptAction } from '../constants';
import { getTagIds } from '../export-projects.handler';
import { getProjectsFinalReport } from './get-projects-final-reports';

const handleStateless = async () => {
  const config = getConfig().export;
  const {
    statusFilter,
    teamId,
    projectFilter,
  } = config;
  const filterTagIds = projectFilter && projectFilter.tags ? await getTagIds(teamId, projectFilter.tags) : undefined;

  const filter = {
    statuses: statusFilter,
    teamId,
    kinds: projectFilter?.kind ? [projectFilter?.kind] : [],
    daysCreatedRange: projectFilter?.date
      ? {
          newestDate: projectFilter.date.newestDate,
          oldestDate: projectFilter.date?.oldestDate,
        }
      : undefined,
    tags: filterTagIds,
  };
  getLogger().info('retrieving projects with filters', { filter });

  const projects = await getProjects(filter);
  getLogger().info(`found ${projects.length} projects to export`);

  const chunkOfProjects: Project[][]= chunk(projects, 100);

  const header = [
    'Project Name',
    'File',
    'Row Number',
    'Team Member',
    'Role',
    'Total Labels Applied',
    'Accepted Labels',
    'Rejected Labels',
    'Precision',
    'Recall',
    'Pass',
    'Fail',
    'DPO',
    'DPU'
  ];

  chunkOfProjects.forEach(async (projectsToExport, index) => {
    getLogger().info(`[START] export projects... ${(index + 1)}/${chunkOfProjects.length}`);
    
    const projectIds = projectsToExport.map((project) => project.id);
    const projectsFinalReport: ProjectFinalReport[] = await getProjectsFinalReport(projectIds);
    getLogger().info(projectsFinalReport.map((projectFinalReport) => projectFinalReport.project.id));

    
    projectsFinalReport.forEach((projectFinalReport) => {
      const csvContent = projectFinalReport.documentFinalReports.reduce((result, documentFinalReport) => {
        const rowFinalReports: RowFinalReport[] = (documentFinalReport.rowFinalReports || []);
        if (rowFinalReports.length > 0) {
          const contentRowFinalReports = rowFinalReports.reduce((resultRow, rowFinalReport) => {
            resultRow.push(generateContent(
              projectFinalReport.project,
              documentFinalReport.document,
              rowFinalReport.line + 1,
              documentFinalReport.teamMember,
              documentFinalReport.cabinet,
              rowFinalReport.finalReport
            ));
            return resultRow;
          }, [] as string[][]);
          result = [...result, ...contentRowFinalReports];
        } else {
          result = [...result, generateContent(
            projectFinalReport.project,
            documentFinalReport.document,
            1,
            documentFinalReport.teamMember,
            documentFinalReport.cabinet,
            documentFinalReport.finalReport
          )];
        }
        return result;
      }, [] as string[][]);
      const csvData = unparse([header, ...csvContent]);
      publishFile(`${projectFinalReport.project.name}_${projectFinalReport.project.id}`, csvData, config);
    });

    getLogger().info(`[END] export projects... ${(index + 1)}/${chunkOfProjects.length}`);
  });
  getLogger().info('exiting script...');
};

function generateContent(project, document, line, teamMember, cabinet, finalReport): string[] {
  return [
    project.name,
    document.fileName,
    line,
    teamMember.user?.email || teamMember.invitationEmail || teamMember.id,
    cabinet.role,
    finalReport.totalAppliedLabels,
    cabinet.role === 'REVIEWER' ? 'N/A' : finalReport.totalAcceptedLabels,
    cabinet.role === 'REVIEWER' ? 'N/A' : finalReport.totalRejectedLabels,
    cabinet.role === 'REVIEWER' ? 'N/A' : finalReport.precision,
    cabinet.role === 'REVIEWER' ? 'N/A' : finalReport.recall,
    cabinet.role === 'REVIEWER' ? 'N/A' : (finalReport.totalRejectedLabels === 0 ? 1 : 0),
    cabinet.role === 'REVIEWER' ? 'N/A' : (finalReport.totalRejectedLabels > 0 ? 1 : 0),
    cabinet.role === 'REVIEWER' ? 'N/A' : ((finalReport.totalAcceptedLabels / finalReport.totalAcceptedLabels * 100) + '%'),
    cabinet.role === 'REVIEWER' ? 'N/A' : (finalReport.totalRejectedLabels === 0 ? '100%' : '0%'),
  ]
}

export async function handleExportFinalReport(configFile: string) {
  setConfigByJSONFile(configFile, getProjectExportValidators(), ScriptAction.PROJECT_EXPORT);

  const stateless = getConfig().export.executionMode === StateConfig.STATELESS;

  if (stateless) {
    getLogger().info('executing stateless export using filter from config');
    return handleStateless();
  }

  throw new Error(`Only supports stateless execution mode`);
}
