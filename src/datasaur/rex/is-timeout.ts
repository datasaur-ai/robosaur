import { parseDate } from '../utils/parse-date';

const MAX_TIMEOUT_IN_MINUTES = Number(process.env.MAX_TIMEOUT_IN_MINUTES ?? 30);

export const isTimeout = (startOcr: string) => {
  const timeInMinutes = countTime(startOcr);
  return timeInMinutes && timeInMinutes >= MAX_TIMEOUT_IN_MINUTES;
};

const countTime = (recordTimestamp: string) => {
  if (!recordTimestamp) return;
  const recordTime = parseDate(recordTimestamp);
  const timeNow = new Date();

  const td = timeNow.getTime() - recordTime.getTime();
  return Math.floor(td / 1000 / 60);
};
