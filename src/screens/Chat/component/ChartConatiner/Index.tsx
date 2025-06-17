import { IChat } from '@/types/chat';
import clsx from 'clsx';
import React from 'react';
import { ChatItem } from '../ChatItem';

type TChartContainer = {
  chats: IChat[];
  containerTitle: string;
  isOlder?: boolean;
};
const ChartContainer: React.FC<TChartContainer> = ({
  chats,
  containerTitle,
  isOlder = false,
}) => {
  return (
    <div
      className={clsx('px-1.5 py-4', {
        '!py-[10px]': isOlder,
      })}
    >
      <h4 className="pl-5 text-[10px] font-radio leading-[9px] font-normal text-[#C9C9E280] mb-1">
        {containerTitle}
      </h4>
      <div>
        {chats.map(chat => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
};

export default ChartContainer;
