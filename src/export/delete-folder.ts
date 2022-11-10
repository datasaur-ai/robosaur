import { rmSync } from 'fs';
import { getLogger } from '../logger';

export function deleteFolder(directory: string) {
  getLogger().info(`removing directory and contents of ${directory}...`);
  rmSync(directory, { recursive: true, force: true });
}
