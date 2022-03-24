import { Config } from '../../../config/interfaces';
import { LabelSetTextProjectInput } from '../../../generated/graphql';
import { labelSetMapper } from './label-set.mapper';

describe('labelSetMapper', () => {
  it('should map labelSetMapper from PCW to robosaur config', () => {
    const fromPcw: LabelSetTextProjectInput[] = [
      {
        name: 'LabelSet1',
        options: [
          {
            id: 'dl9g4qMMRrRsje90azncy',
            parentId: null,
            label: 'test',
            color: null,
          },
        ],
      },
    ];

    const mapped: Config['project']['labelSets'] = [
      {
        label: 'LabelSet1',
        config: {
          options: [
            {
              id: 'dl9g4qMMRrRsje90azncy',
              parentId: null,
              label: 'test',
              color: null,
            },
          ],
        },
      },
    ];

    const result = labelSetMapper.fromPcw(fromPcw);

    expect(result).toEqual(mapped);
  });
});
