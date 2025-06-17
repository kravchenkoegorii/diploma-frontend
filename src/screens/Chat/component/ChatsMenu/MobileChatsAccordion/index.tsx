import * as Accordion from '@radix-ui/react-accordion';
import { AnimatePresence, motion, useWillChange } from 'framer-motion';
import clsx from 'clsx';
import { getFilteredCharts } from '@/utilities/filteredChart';
import { IChat } from '@/types/chat';
import { useMemo } from 'react';
import { useChatsStore } from '@/stores/chats';
import { useShallow } from 'zustand/shallow';
import ChartContainer from '../../ChartConatiner/Index';
import useSWR from 'swr';
import { usePrivy } from '@privy-io/react-auth';
import { chatService } from '@/services/chatService';
import { AiOutlinePlus } from 'react-icons/ai';

interface IProps {
  openAccordion: string | null;
  setOpenAccordion: (value: string | null) => void;
  handleCreateChat: () => void;
}

export const MobileChatsAccordion = ({
  openAccordion,
  setOpenAccordion,
  handleCreateChat,
}: IProps) => {
  const willChange = useWillChange();
  const selectedChatId = useChatsStore(useShallow(s => s.selectedChat?.id));
  const { user } = usePrivy();

  const { data: chats } = useSWR(
    user ? '/chats' : undefined,
    () => chatService.getChats(),
    {
      revalidateOnFocus: !!selectedChatId && !!user,
    }
  );
  const { todayChart, yesterDayChart, thisWeekChart, olderChat } =
    getFilteredCharts(chats as IChat[]);

  const selectedChatForAccordion = useMemo(() => {
    const selectedChat = chats?.find(chat => chat.id === selectedChatId);

    if (!selectedChat) {
      return null;
    }
    return {
      ...selectedChat,
      title: selectedChat.title || `Room ${chats?.length || 1}`,
    };
  }, [selectedChatId, chats]);

  const [isSubmitting] = useChatsStore(
    useShallow(s => [s.isSubmitting, s.isTransactionSubmitting])
  );

  return (
    <Accordion.Root
      className={`relative ${!openAccordion && 'h-full'} border border-[#fff]/10 pt-4 leading-[16.4px] rounded-[16px] bg-white bg-opacity-[3%] z-[999] transition-all duration-300 ease-in-out `}
      type="single"
      collapsible
      value={openAccordion === 'chat' ? 'open' : ''}
      onValueChange={value => setOpenAccordion(value ? 'chat' : null)}
    >
      {openAccordion && (
        <div className="absolute inset-0 z-[-999] bg-gradient-to-b from-[#28282A] to-[#48484E] h-full w-full rounded-[16px]" />
      )}
      <Accordion.Item value="open">
        <Accordion.Trigger
          className={clsx(
            'cursor-pointer w-full box-border flex justify-between items-center px-4 data-[state=open]:border-none',
            openAccordion && 'pb-4 pt-2'
          )}
        >
          {chats && chats.length > 0 && (
            <span
              className={clsx(
                'w-full text-nowrap',
                selectedChatForAccordion?.title &&
                  selectedChatForAccordion.title.length >= 15
                  ? 'bg-gradient-to-r from-white via-white to-transparent text-transparent bg-clip-text text-[#fff] whitespace-nowrap overflow-hidden'
                  : 'text-[#fff]',
                !openAccordion ? 'max-w-[15vw]' : 'max-w-[100vw]'
              )}
            >
              {selectedChatForAccordion?.title
                ? selectedChatForAccordion.title
                : `Room ${chats.length + 1}`}
            </span>
          )}
          <div
            className={clsx(
              'absolute right-6 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-[#8C8C8C] transform transition duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] flex-shrink-0',
              '[[data-state="open"]>&]:rotate-[0deg] rotate-[180deg]'
            )}
          ></div>
        </Accordion.Trigger>
        <Accordion.Content forceMount asChild>
          <AnimatePresence mode="wait" initial={false}>
            {openAccordion === 'chat' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ willChange }}
                className="content flex flex-col h-auto rounded-[16px] w-full"
              >
                <div className="overflow-y-auto scrollbar-hidden h-[30vh] ">
                  {todayChart.length > 0 && (
                    <ChartContainer chats={todayChart} containerTitle="Today" />
                  )}
                  {yesterDayChart.length > 0 && (
                    <ChartContainer
                      chats={yesterDayChart}
                      containerTitle="Yesterday"
                      isOlder={true}
                    />
                  )}
                  {thisWeekChart.length > 0 && (
                    <ChartContainer
                      chats={thisWeekChart}
                      containerTitle="Previous 7 days"
                      isOlder={true}
                    />
                  )}
                  {olderChat.length > 0 && (
                    <ChartContainer
                      chats={olderChat}
                      containerTitle="Older chats"
                      isOlder={true}
                    />
                  )}
                </div>
                <button
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  type="button"
                  className={clsx(
                    'flex gap-5 justify-between w-full box-border items-center text-[#fff] disabled:opacity-50 disabled:pointer-events-none cursor-pointer px-[26px] py-5 hover:opacity-50 duration-300',
                    !user && 'hidden'
                  )}
                  onClick={() => {
                    handleCreateChat();
                    setOpenAccordion(null);
                  }}
                  disabled={isSubmitting || !chats || chats.length <= 0}
                >
                  New Room <AiOutlinePlus className="text-white/40" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};
