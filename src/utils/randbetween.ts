export const randbetween = (min: number, max: number) => {
  return (Math.round(Math.random() * 100) % max) + min;
};
