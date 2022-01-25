import { Readable as ReadableStream } from 'stream';
export function streamToString(stream: ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let stringValue = '';
    stream.on('data', onData);
    stream.on('end', onEnd);
    stream.on('error', onEnd);
    stream.on('close', onClose);

    function onData(data) {
      stringValue += data;
    }

    function onEnd(error) {
      if (error) reject(error);
      else resolve(stringValue);
      cleanup();
    }

    function onClose() {
      resolve(stringValue);
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
