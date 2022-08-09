import { getConfig } from '../../../config/config';
import { parseVersion } from './compareVersion';
import fetch from 'node-fetch';

export async function getDatasaurVersion() {
  const result = await fetch(`${getConfig().datasaur.host}/api/front-end-configuration`);
  const resJson = await result.json();
  const version = resJson.app.version;

  return parseVersion(version);
}
