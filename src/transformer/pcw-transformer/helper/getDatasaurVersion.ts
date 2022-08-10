import axios from 'axios';
import { getConfig } from '../../../config/config';
import { parseVersion } from './compareVersion';

export async function getDatasaurVersion() {
  const res = await axios.get(`${getConfig().datasaur.host}/api/health`);
  return parseVersion(res.data.version);
}
