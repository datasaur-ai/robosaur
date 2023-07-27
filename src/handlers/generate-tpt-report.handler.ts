import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import getUnixTime from 'date-fns/getUnixTime';
import { isEmpty } from 'lodash';
import { resolve } from 'path';
import { setConfigByJSONFile } from '../config/config';
import { getGenerateTptReportValidators } from '../config/schema/validator';
import { getProjectsWithAssignment } from '../datasaur/get-projects-with-assignment';
import { getRowAnalyticEvents } from '../datasaur/get-row-analytic-events';
import { createSimpleHandlerContext } from '../execution';
import { getLogger, getLoggerService } from '../logger';
import { sleep } from '../utils/sleep';
import { ScriptAction } from './constants';
import { generateFilePath, generateUnixTimestampRanges, resolveEndOfDayEndDate } from './generate-tpt-report/helpers';
import { RowAnalyticEventResponse } from './generate-tpt-report/interfaces';
import { ProjectCollection } from './generate-tpt-report/project-collection';
import { ReportBuilder } from './generate-tpt-report/report-builder';
import { writeToCsv } from './generate-tpt-report/writer';

const DEFAULT_SIZE_PER_REQUEST = 500;
const MAX_RETRY_ATTEMPTS = 3;

export const handleGenerateTptReport = createSimpleHandlerContext('generate-tpt-report', _handleGenerateTptReport);

export interface GenerateTptReportOptions {
  startDate?: string;
  endDate?: string;
  all?: boolean;
  outDir?: string;
}

export async function _handleGenerateTptReport(teamId: string, configFile: string, options: GenerateTptReportOptions) {
  const { startDate, endDate, all, outDir } = options;

  getLoggerService().registerResolver(() => {
    return {
      teamId,
    };
  });

  // setup the configuration json
  setConfigByJSONFile(resolve(configFile), getGenerateTptReportValidators(), ScriptAction.TPT_REPORT, teamId);

  // get All projects within the team
  const allProjects = await getProjectsWithAssignment(teamId);

  // create project collection
  const projectCollection = new ProjectCollection(allProjects);

  // generateAll or within a Date Range
  if (all) {
    await generateReportAllTime(teamId, projectCollection, outDir);
  } else {
    await generateReportWithinDateRange(teamId, projectCollection, startDate, endDate, outDir);
  }
}

async function generateReportAllTime(teamId: string, projectCollection: ProjectCollection, outDir?: string) {
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

    getLogger().info(`\nProcessing events from ${startDate} to ${endDate}...`);

    await fetchAndProcessAllEventsWithinDateRange(teamId, reportBuilder, startDate, endDate);
  }

  const fileName = generateFilePath(teamId, undefined, outDir);
  await writeToCsv(fileName, reportBuilder.getReport());
  getLogger().info(`\nThe report is available now: ${fileName}`);
}

async function generateReportWithinDateRange(
  teamId: string,
  projectCollection: ProjectCollection,
  startDate?: string,
  endDate?: string,
  outDir?: string,
) {
  const reportBuilder = new ReportBuilder(projectCollection);
  getLogger().info(`Generating timestamp TPT report for team id ${teamId} at ${new Date().toISOString()}...`);

  const { isError, startAt, endAt } = await fetchAndProcessAllEventsWithinDateRange(
    teamId,
    reportBuilder,
    startDate,
    endDate,
  );

  const resolvedEndDate = format(
    endDate ? new Date(endDate) : startDate ? addDays(new Date(startDate), 7) : new Date(),
    'MM-dd-yy',
  );

  getLogger().debug(`endDate ${endDate ?? '-'} / startDate ${startDate ?? '-'} resolved to ${resolvedEndDate}`);

  if (!isError) {
    if (isEmpty(reportBuilder.getReport())) {
      getLogger().warn('Sorry, but there is no row being labeled at the current period');
      getLogger().warn('No report will be generated');
    } else {
      const fileName = generateFilePath(
        teamId,
        { startDate: startAt ?? new Date(), endDate: endAt ?? new Date() },
        outDir,
      );
      await writeToCsv(fileName, reportBuilder.getReport());
      getLogger().info(`The report is available now: ${fileName}`);
      getLogger().info(`It's generated from ${startAt?.toISOString()} until ${endAt?.toISOString()}`);
    }
  }
}

async function fetchAndProcessAllEventsWithinDateRange(
  teamId: string,
  reportBuilder: ReportBuilder,
  startDate?: string,
  endDate?: string,
) {
  let totalEventProcessed = 0;
  let done = false;
  let cursor: string | null = null;
  let isError = false;
  let startAt: Date | undefined;
  let endAt: Date | undefined;

  while (!done) {
    let result: RowAnalyticEventResponse;
    try {
      result = await getEventsWithRetries(teamId, cursor, startDate, endDate);
      if (!startAt && result?.getRowAnalyticEvents?.nodes?.length > 0) {
        startAt = fromUnixTime(+result.getRowAnalyticEvents.nodes[0].createdAt / 1000);
      }
    } catch (error) {
      getLogger().error('Sorry, there is currently something wrong with Datasaur API');
      getLogger().error('Please try again later or contact Datasaur and send this error below');
      getLogger().error(error);
      done = true;
      isError = true;
      continue;
    }

    processEvents(result, reportBuilder);

    if (result?.getRowAnalyticEvents?.pageInfo?.nextCursor === null) {
      if (result?.getRowAnalyticEvents?.nodes?.length > 0) {
        endAt = fromUnixTime(+result.getRowAnalyticEvents.nodes[0].createdAt / 1000);
      }
      done = true;
    } else {
      cursor = result?.getRowAnalyticEvents?.pageInfo?.nextCursor;
    }

    const totalNodes = result?.getRowAnalyticEvents?.nodes?.length;
    if (totalNodes) {
      totalEventProcessed += result.getRowAnalyticEvents.nodes.length;
      getLogger().info(`Successfully process ${totalEventProcessed} events`);
    }

    await sleep(1000);
  }

  return { isError, startAt, endAt };
}

function processEvents(result: RowAnalyticEventResponse, reportBuilder: ReportBuilder) {
  if (result?.getRowAnalyticEvents?.nodes) {
    for (const node of result.getRowAnalyticEvents.nodes) {
      reportBuilder.processEvent(node);
    }
  }
}

async function getEventsWithRetries(teamId: string, cursor: string | null, startDate?: string, endDate?: string) {
  let result: RowAnalyticEventResponse;
  let retryAttempts = 1;

  const endOfDayOfEndDate = resolveEndOfDayEndDate(endDate);

  do {
    try {
      result = await getRowAnalyticEvents(teamId, DEFAULT_SIZE_PER_REQUEST, cursor, startDate, endOfDayOfEndDate);
      break;
    } catch (error) {
      retryAttempts++;
      if (retryAttempts > MAX_RETRY_ATTEMPTS) {
        throw new Error(error);
      }
      await sleep(1000);
    }
  } while (retryAttempts <= MAX_RETRY_ATTEMPTS);

  return result!;
}
