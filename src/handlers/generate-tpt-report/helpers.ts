import { UnixTimestampRange } from "./interfaces";

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
