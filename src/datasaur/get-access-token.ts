import qs from 'qs';
import axios from 'axios';

export async function getAccessToken(url: string, clientId: string, clientSecret: string) {
  const data = { client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' };

  const response = await axios({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data),
    url: `${url}/api/oauth/token`,
    timeout: 10000,
  });
  return response.data.access_token;
}
