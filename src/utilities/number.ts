export const formatNumber = (
  value: string | number,
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {
    maximumFractionDigits: 5,
    minimumFractionDigits: 1,
  }
) => {
  return new Intl.NumberFormat(locale, options).format(+value);
};
