import { getConfig } from '../config';
import { CreateConfig } from '../interfaces';

export const setConfigFromSchema = () => {
  getConfig().project = getConfig().create as CreateConfig;
};
