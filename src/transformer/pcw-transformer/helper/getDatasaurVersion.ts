import { getConfig } from '../../../config/config';
import fetch from 'node-fetch';

export async function getDatasaurVersion() {
  const result = await fetch(`${getConfig().datasaur.host}/api/front-end-configuration`);
  const resJson = await result.json();
  return resJson.app.version;
}
