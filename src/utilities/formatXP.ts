export const formatXP = (xp: number) => {
  const floored = Math.floor(xp);
  return floored.toLocaleString('en-US');
};
