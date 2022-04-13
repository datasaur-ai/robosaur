import PromptSync from 'prompt-sync';
import { getLogger } from '../../logger';
import { clearDirectory } from './clearDirectory';

export const deleteAllFilesFromDirectory = async (paths: Array<string>, withPrompt = false) => {
  if (withPrompt) {
    const prompt = PromptSync();

    console.log(`The following folders will be emptied ${paths}.`);
    const response = prompt('Are you sure you want to continue? (Y/n): ');

    if (response === 'N' || response === 'n') {
      getLogger().info('canceling process');
      process.exit(0);
    } else if (response === 'Y' || response === 'y') {
      paths.forEach((path) => {
        getLogger().info(`clearing ${path} directory`);
        clearDirectory(path);
      });
    } else {
      throw new Error(`${response} is not an acceptable option`);
    }
  } else {
    paths.forEach((path) => {
      getLogger().info(`clearing ${path} directory`);
      clearDirectory(path);
    });
  }
};
