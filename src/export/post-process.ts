import axios from 'axios';
import { PostProcessError } from '../datasaur/rex/errors/post-process-error';

export async function postProcessDocumentData(data) {
  if (!data) return null;

  const payload = {
    document_data: data,
  };
  const postProcessEndpoint = process.env.POST_PROCESS_DOCUMENT_DATA_ENDPOINT;

  try {
    const response = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: payload,
      url: postProcessEndpoint,
      timeout: 30000,
    });
    return response.data;
  } catch (e) {
    throw new PostProcessError(e);
  }
}
