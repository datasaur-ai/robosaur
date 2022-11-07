import { formatDate } from './format-date';

describe(formatDate.name, () => {
  it('should format date correctly', () => {
    const ISODate = '2022-11-07T12:04:00';
    const date = new Date(ISODate);
    const formattedDate = formatDate(date);
    const expectedDateFormat = '07-11-2022 12:04:00';

    expect(formattedDate).toEqual(expectedDateFormat);
  });
});
