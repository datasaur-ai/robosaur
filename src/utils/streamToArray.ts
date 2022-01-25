import { Readable as ReadableStream } from 'stream';

export function streamToArray(stream: ReadableStream): Promise<any[]> {
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
      else resolve(array);
      cleanup();
    }

    function onClose() {
      resolve(array);
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
