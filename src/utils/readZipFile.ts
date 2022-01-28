import Zip from 'adm-zip';
import internal from 'stream';

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

function streamToBuffer(stream: internal.Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const array: any[] = [];
    stream.on('data', onData);
    stream.on('end', onEnd);
    stream.on('error', onEnd);
    stream.on('close', onClose);

    function onData(data) {
      array.push(data);
    }

    function onEnd(error) {
      if (error) reject(error);
      else resolve(Buffer.concat(array));
      cleanup();
    }

    function onClose() {
      resolve(Buffer.concat(array));
      cleanup();
    }

    function cleanup() {
      stream.removeListener('data', onData);
      stream.removeListener('end', onEnd);
      stream.removeListener('error', onEnd);
      stream.removeListener('close', onClose);
    }
  });
}
