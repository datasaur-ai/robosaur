export const parseDate = (dateString: string) => {
  const year = dateString.slice(6, 10);
  const month = dateString.slice(3, 5);
  const day = dateString.slice(0, 2);
  const hour = dateString.slice(11, 13);
  const minute = dateString.slice(14, 16);
  const second = dateString.slice(17);

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
};
