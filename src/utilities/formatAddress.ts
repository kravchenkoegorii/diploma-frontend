export const formatAddress = (
  address: string,
  startChars = 5,
  endChars = 9
) => {
  return (
    address.slice(0, startChars) +
    '...' +
    (endChars === 0 ? '' : address.slice(-endChars))
  );
};
