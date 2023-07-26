import { UnixTimestampRange } from './interfaces';
import format from 'date-fns/format';
import { resolve } from 'path';

export const calculateDiffInSeconds = (firstEpoch: string, secondEpoch: string) =>
  +((+secondEpoch - +firstEpoch) / 1000);

export const generateUnixTimestampRanges = (
  startTimestamp: number,
  endTimestamp: number,
  durationPerRange: number,
): UnixTimestampRange[] => {
  let currentTimestamp = startTimestamp;
  const result: UnixTimestampRange[] = [];

  while (currentTimestamp <= endTimestamp) {
    result.push({
      start: currentTimestamp,
      end: Math.min(currentTimestamp + durationPerRange, endTimestamp),
    });

    currentTimestamp += durationPerRange + 1;
  }

  return result;
};

function base32(num: number) {
  return num.toString(32);
}

function extractHumanReadableTimeRange(range: { startDate: Date; endDate: Date }): string {
  const stringFormat = 'yyyy_MM';
  const start = format(range.startDate, stringFormat);
  const end = format(range.endDate, stringFormat);
  return `${start}-${end}`;
}

export function generateFilePath(teamId: string, range?: { startDate: Date; endDate: Date }, outDir?: string) {
  const timestamp = new Date();
  const timestampBase32 = base32(timestamp.getTime());
  const timeRange = range ? extractHumanReadableTimeRange(range) : 'all-time';
  const fileName = `${timestampBase32}-tpt-report-${timeRange}-team-${teamId}.csv`;
  if (outDir) {
    return resolve(outDir, fileName);
  }
  return fileName;
}
