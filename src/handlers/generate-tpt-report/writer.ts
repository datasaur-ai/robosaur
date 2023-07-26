import { createWriteStream } from 'fs';
import Papa from 'papaparse';
import { ReportDictionary } from './interfaces';

export async function writeToCsv(fileName: string, data: ReportDictionary) {
  const stream = createWriteStream(fileName);
  const csvData: string[][] = [];

  for (const documentId of Object.keys(data)) {
    for (const line of Object.keys(data[documentId])) {
      for (const userId of Object.keys(data[documentId][line])) {
        const node = data[documentId][line][userId];
        console.log(node.startDate);
        csvData.push([
          node.projectId,
          node.projectName,
          node.fileId,
          node.fileName,
          node.rowNumber + 1,
          node.teamMember,
          node.role,
          node.projectAssignmentRole,
          new Date(+node.startDate).toISOString(),
          new Date(+node.endDate).toISOString(),
          (node.duration / 60).toFixed(2),
        ]);
      }
    }
  }

  const parsedCsvData = Papa.unparse(csvData);
  stream.once('open', () => {
    stream.write(
      `"Project ID","Project Name","File ID","File Name","Row Number","Team Member","Role","Project Assignment Role","Start Date (UTC)","End Date (UTC)","Duration (minutes)"\n`,
    );
    stream.write(`${parsedCsvData}\n`);
    stream.end();
  });
}
