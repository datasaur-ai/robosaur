import { getProjectsWithAssignment } from '../datasaur/get-projects-with-assignment';
import { createSimpleHandlerContext } from '../execution';
import { getLogger, getLoggerService } from '../logger';
import { ProjectCollection } from './generate-tpt-report/project-collection';
import { ReportBuilder } from './generate-tpt-report/report-builder';
import getUnixTime from 'date-fns/getUnixTime';
import fromUnixTime from 'date-fns/fromUnixTime';
import { generateUnixTimestampRanges } from './generate-tpt-report/helpers';
import { ReportDictionary } from './generate-tpt-report/interfaces';

export const handleGenerateTptReport = createSimpleHandlerContext('generate-tpt-report', _handleGenerateTptReport);

export interface GenerateTptReportOptions {
  startDate?: string;
  endDate?: string;
  all?: boolean;
}

export async function _handleGenerateTptReport(teamId: string, configFile: string, options: GenerateTptReportOptions) {
  // setup the configuration json
  // TODO

  getLoggerService().registerResolver(() => {
    return {
      teamId,
    };
  });

  // get All projects within the team
  const allProjects = await getProjectsWithAssignment(teamId);

  // create project collection
  const projectCollection = new ProjectCollection(allProjects);

  // generateAll or within a Date Range
  if (options.all) {
    await generateReportAllTime(teamId, projectCollection);
  } else {
    await generateReportWithinDateRange();
  }
}

async function generateReportAllTime(teamId: string, projectCollection: ProjectCollection) {
  // instantiate report builder
  getLogger().info('generating report all time');
  const reportBuilder = new ReportBuilder(projectCollection);

  const firstProject = projectCollection.getFirstProject();
  const firstProjectCreatedAtTimestamp = firstProject
    ? getUnixTime(new Date(firstProject.createdDate))
    : getUnixTime(new Date());
  const currentTimestamp = getUnixTime(new Date());
  const timestampRanges = generateUnixTimestampRanges(firstProjectCreatedAtTimestamp, currentTimestamp, 7 * 24 * 3600); // Backend can process at most 7-day range

  for (const timestampRange of timestampRanges) {
    const startDate = fromUnixTime(timestampRange.start).toISOString();
    const endDate = fromUnixTime(timestampRange.end).toISOString();

    console.log(`\nProcessing events from ${startDate} to ${endDate}...`);

    await fetchAndProcessAllEventsWithinDateRange(teamId, reportBuilder, startDate, endDate);
  }

  const fileName = `all-time-timestamp-tpt-team-${teamId}.csv`;
  writeToCsv(fileName, reportBuilder.getReport());
  console.log(`\nThe report is available now: ${fileName}`);
}

async function generateReportWithinDateRange() {
  getLogger().info('');
}

async function fetchAndProcessAllEventsWithinDateRange(
  teamId: string,
  reportBuilder: ReportBuilder,
  startDate?: string,
  endDate?: string,
) {
  let totalEventProcessed = 0;
  let done = false;
  let cursor = null;
  let isError = false;
  let startAt: Date | undefined;
  let endAt: Date | undefined;

  // TODO
}

function writeToCsv(fileName: string, reportDictionary: ReportDictionary) {}
