import axios, { AxiosResponse } from 'axios';
import internal from 'stream';
import { getLogger } from '../../logger';

export async function downloadFromPreSignedUrl(url: string) {
  try {
    const result: AxiosResponse<internal.Readable> = await axios.get(url, { responseType: 'stream' });
    return result;
  } catch (error) {
    getLogger().error(`fail in downloading from presigned URL`, { error: { message: error.message } });
    throw new Error(`fail in downloading from presigned URL`);
  }
}
