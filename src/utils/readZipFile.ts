import Zip from 'adm-zip';
import internal from 'stream';
import { streamToBuffer } from './stream/streamToBuffer';

export async function readZipStream(stream: internal.Readable) {
  const zip = new Zip(await streamToBuffer(stream));
  const files: Array<{
    filename: string;
    content: string;
  }> = [];

  for (const entry of zip.getEntries()) {
    if (!entry.isDirectory) {
      if (entry.entryName.includes('/REVIEW/')) {
        files.push({
          filename: entry.name,
          content: zip.readAsText(entry),
        });
      }
    }
  }
  return files;
}
