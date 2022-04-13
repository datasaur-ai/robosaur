import { readdirSync } from 'fs';
import { resolve } from 'path';
import { getLogger } from '../../logger';

export async function getClientNames(path: string) {
  getLogger().info(`retrieving folders in local directory ${path} `);
  const dirpath = resolve(process.cwd(), path);
  const directories = readdirSync(dirpath, { withFileTypes: true }).filter((p) => p.isDirectory());
  return directories.map((dir) => ({ name: dir.name, fullPath: resolve(dirpath, dir.name) }));
}
