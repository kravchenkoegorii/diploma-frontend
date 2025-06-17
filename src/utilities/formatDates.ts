import { differenceInDays, isToday, isYesterday } from 'date-fns';

export const isTodayChat = (value: string) => {
  return isToday(new Date(value));
};

export const isYesterdayChart = (value: string) => {
  return isYesterday(new Date(value));
};

export const hasSevenDays = (value: string) => {
  if (isYesterdayChart(value) || isTodayChat(value)) {
    return false;
  }
  const today = new Date();
  const daysDifference = differenceInDays(today, value);
  return daysDifference <= 7;
};

export const hasSevenDaysPassed = (value: string) => {
  const today = new Date();
  const daysDifference = differenceInDays(today, value);
  return daysDifference > 7;
};
