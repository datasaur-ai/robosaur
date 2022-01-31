import { readdirSync } from 'fs';
import { basename, parse, resolve } from 'path';
import { Config } from '../config/interfaces';
import { LabelItem, LabelSet } from '../datasaur/interfaces';
import { getLogger } from '../logger';
import { defaultCSVConfig, readCSVFile } from './readCSVFile';

interface LabelCSVContent {
  id: string;
  label: string;
  color: string;
}

const LABELSET_COUNT_LIMIT = 10;

export function getLabelSetsFromDirectory({ project }: Config): LabelSet[] {
  const directory = project.labelSetDirectory;

  if (directory) {
    getLogger().info('retrieving list of labelset files in directory');
    const filesInDir = readdirSync(directory, { withFileTypes: true })
      .filter((dirEntries) => dirEntries.isFile() && dirEntries.name.endsWith('.csv'))
      .sort((entry1, entry2) => {
        return entry1.name.localeCompare(entry2.name);
      });

    if (filesInDir.length > LABELSET_COUNT_LIMIT) {
      getLogger().error(
        `currently Datasaur supports up to ${LABELSET_COUNT_LIMIT} labelsets, you have ${filesInDir.length} csv files in the directory`,
      );
      throw new Error(`more than ${LABELSET_COUNT_LIMIT} labelsets defined`);
    }

    getLogger().info(
      `found ${filesInDir.length} labelset file in ${directory}`,
      JSON.stringify(filesInDir.map((file) => file.name)),
    );
    return filesInDir.map((file) => parseCSVToLabelSet(resolve(directory, file.name)));
  } else {
    getLogger().info('no labelSetDirectory in config file');
    return project.labelSets as LabelSet[];
  }
}

function parseCSVToLabelSet(filepath: string): LabelSet {
  const content = readCSVFile(filepath, 'utf-8', { ...defaultCSVConfig, header: true });
  const items: LabelItem[] = content.data.map(({ id, label, color }: LabelCSVContent, index) => {
    return {
      id: id ?? index.toString(),
      label,
      color,
      parentId: id && id.includes('.') ? getParentId(id) : null,
    };
  });

  return {
    label: removeLeadingNumber(parse(basename(filepath)).name),
    config: {
      options: items,
    },
  };
}

function getParentId(id: string) {
  const parts = id.split('.');
  parts.pop();
  return parts.join('.');
}

function removeLeadingNumber(text: string) {
  return text.replace(/^(\d*)/, '').trim();
}
