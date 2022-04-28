import { getLabelSetsFromDirectory } from './labelset';

describe(getLabelSetsFromDirectory.name, () => {
  it('should parse sample labelsets correctly', () => {
    const labelsets = getLabelSetsFromDirectory({
      create: { labelSetDirectory: 'sample/__shared__/labelset' },
    } as any);

    expect(labelsets.length).toEqual(3);
    expect(labelsets[0].label).toEqual('sample-hierarchical');
  });
});
