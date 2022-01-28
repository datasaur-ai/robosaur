import axios, { AxiosResponse } from 'axios';
import internal from 'stream';

export async function downloadFromPreSignedUrl(url: string) {
  const result: AxiosResponse<internal.Readable> = await axios.get(url, { responseType: 'stream' });
  return result;
}
