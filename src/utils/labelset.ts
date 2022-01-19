import { readdirSync } from 'fs';
import { basename, resolve, parse } from 'path';
import { LabelItem } from '../datasaur/interfaces';
import { defaultCSVConfig, readCSVFile } from './readCSVFile';

const LABELSET_COUNT_LIMIT = 5;

export interface LabelSet {
  label: string;
  config: {
    options: LabelItem[];
  };
}

export function getLabelSetsFromDirectory(directory: string): LabelSet[] {
  console.log('Retrieving list of labelset files in directory');
  const filesInDir = readdirSync(directory, { withFileTypes: true })
    .filter((dirEntries) => dirEntries.isFile() && dirEntries.name.endsWith('.csv'))
    .sort((entry1, entry2) => {
      return entry1.name.localeCompare(entry2.name);
    });

  if (filesInDir.length > LABELSET_COUNT_LIMIT) {
    console.error(`Currently Datasaur supports up to ${LABELSET_COUNT_LIMIT} labelsets`);
    throw new Error(`More than ${LABELSET_COUNT_LIMIT} labelsets defined`);
  }

  console.log(`Found ${filesInDir.length} labelset file in ${directory}`);
  console.log(JSON.stringify(filesInDir.map((file) => file.name)));
  return filesInDir.map((file) => parseCSVToLabelSet(resolve(directory, file.name)));
}

interface LabelCSVContent {
  id: string;
  label: string;
  color: string;
}
function parseCSVToLabelSet(filepath: string) {
  const content = readCSVFile(filepath, 'utf-8', { ...defaultCSVConfig, header: true });
  const items: LabelItem[] = content.data.map(({ id, label, color }: LabelCSVContent) => {
    return {
      id,
      label,
      color,
      parentId: id && id.includes('.') ? getParentId(id) : null,
    };
  });

  return {
    label: parse(basename(filepath)).name,
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
