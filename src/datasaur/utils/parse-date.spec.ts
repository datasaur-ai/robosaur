import { parseDate } from './parse-date';

describe(parseDate.name, () => {
  it('should parse date correctly', () => {
    const formattedDate = '07-11-2022 12:04:00';
    const parsedDate = new Date(parseDate(formattedDate));
    const ISODate = new Date('2022-11-07T12:04:00');

    expect(parsedDate).toEqual(ISODate);
  });
});
