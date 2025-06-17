import { IChat } from '@/types/chat';
import {
  hasSevenDays,
  hasSevenDaysPassed,
  isTodayChat,
  isYesterdayChart,
} from './formatDates';

export const getFilteredCharts = (chats: IChat[]) => {
  const todayChart = chats.filter(({ createdAt }) => isTodayChat(createdAt));
  const yesterDayChart = chats.filter(({ createdAt }) =>
    isYesterdayChart(createdAt)
  );
  const thisWeekChart = chats.filter(({ createdAt }) =>
    hasSevenDays(createdAt)
  );
  const olderChat = chats.filter(({ createdAt }) =>
    hasSevenDaysPassed(createdAt)
  );

  return {
    todayChart,
    yesterDayChart,
    thisWeekChart,
    olderChat,
  };
};
