export const wait = (interval: number) => {
  const waitTill = new Date(new Date().getTime() + interval * 1000);
  while (waitTill > new Date()) {
    continue;
  }
};
