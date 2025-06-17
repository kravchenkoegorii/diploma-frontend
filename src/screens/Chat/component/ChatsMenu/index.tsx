import { getFilteredCharts } from '@/utilities/filteredChart';
import { useLogin, User } from '@privy-io/react-auth';
import * as Accordion from '@radix-ui/react-accordion';
import clsx from 'clsx';
import { AnimatePresence, motion, useWillChange } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useShallow } from 'zustand/shallow';
import { chatsStore, useChatsStore } from '@/stores/chats.ts';
import { IChat } from '@/types/chat.ts';
import ChartContainer from '../ChartConatiner/Index';

interface IChatsMenuProps {
  chats: IChat[];
  user: User;
  isSubmitting: boolean;
  selectedChat: IChat | null | undefined;
  openAccordion: string | null;
  setOpenAccordion: (value: string | null) => void;
  onMessageSelect: (value: string) => void;
}

export const ChatsMenu = ({
  chats,
  user,
  isSubmitting,
  selectedChat,
  openAccordion,
  setOpenAccordion,
}: IChatsMenuProps) => {
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(true);
  const selectedChatId = useChatsStore(useShallow(s => s.selectedChat?.id));
  const willChange = useWillChange();
  const { login } = useLogin();

  useEffect(() => {
    setOpenAccordion(null);
  }, [selectedChat?.id]);

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

  const handleCreateChat = async () => {
    if (!user) {
      login();
      return;
    }

    const { setSelectedChat } = chatsStore.getState();
    setSelectedChat(null);
  };

  const { todayChart, yesterDayChart, thisWeekChart, olderChat } =
    getFilteredCharts(chats);

  const chatRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOpenedChatItemModal = useChatsStore(
    useShallow(s => s.isOpenedChatItemModal)
  );

  const tokenItemRefs = useRef<HTMLDivElement[] | undefined[]>([]);
  const accordionTriggerRefs = useRef<HTMLButtonElement[]>([]);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const sendBtnRef = useRef<HTMLButtonElement | null>(null);
  const reseiveBtnRef = useRef<HTMLButtonElement | null>(null);
  const exportBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isModalOpen) return;
      if (isOpenedChatItemModal) return;
      const target = event.target as Node;

      const isClickInsideTokenItem = tokenItemRefs.current.some(ref =>
        ref?.contains(target)
      );
      const isClickOnAccordionTrigger = accordionTriggerRefs.current.some(ref =>
        ref?.contains(target)
      );

      if (
        !isClickInsideTokenItem &&
        !isClickOnAccordionTrigger &&
        (!copyRef.current || !copyRef.current.contains(target)) &&
        !sendBtnRef?.current?.contains(target) &&
        !reseiveBtnRef?.current?.contains(target) &&
        !exportBtnRef?.current?.contains(target)
      ) {
        setOpenAccordion(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, setOpenAccordion, isOpenedChatItemModal]);

  return (
    <>
      <div className="hidden min-992px:flex flex-col gap-2">
        <Accordion.Root
          className="max-w-[268px] max-992px:absolute max-992px:z-[999] relative border border-[#313132] pt-4 rounded-2xl max-992px:bg-[#2b2923] bg-mauve6 shadow-[0_2px_10px] shadow-black/5"
          type="single"
          collapsible
          value={isChatMenuOpen ? 'open' : ''}
          onValueChange={value => {
            setIsChatMenuOpen(value === 'open');
          }}
        >
          <Accordion.Item value="open">
            <Accordion.Trigger className="cursor-pointer w-[215px] flex justify-between items-center px-[26px] pb-[19px]">
              <div className="whitespace-nowrap overflow-hidden max-w-[197px]">
                {selectedChatForAccordion?.title &&
                selectedChatForAccordion.title.length > 20 ? (
                  <span className="bg-gradient-to-r from-white via-white to-transparent text-transparent bg-clip-text text-[#fff]">
                    {selectedChatForAccordion?.title ||
                      `Room ${chats.length + 1}`}
                  </span>
                ) : (
                  <span className="text-[#fff]">
                    {selectedChatForAccordion?.title ||
                      `Room ${chats.length + 1}`}
                  </span>
                )}
              </div>
              <div
                className={clsx(
                  'w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-[#8C8C8C] transform-transition duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]',
                  '[[data-state="open"]>&]:rotate-[0deg] rotate-[180deg]'
                )}
              ></div>
            </Accordion.Trigger>
            <Accordion.Content forceMount asChild>
              <AnimatePresence mode="wait" initial={false}>
                {isChatMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="content flex flex-col"
                  >
                    <div className="border-b border-[#313132] min-1800px:max-h-[39.8vh] min-1600px:max-h-[30vh] max-height-730px:max-h-[19vh] max-h-[27vh] overflow-y-auto scrollbar-hidden">
                      {todayChart.length > 0 && (
                        <ChartContainer
                          chats={todayChart}
                          containerTitle="Today"
                        />
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
                      type="button"
                      className={clsx(
                        'flex gap-5 justify-between w-full max-w-[215px] items-center text-[#fff] disabled:opacity-50 disabled:pointer-events-none cursor-pointer pl-[26px] pr-[0] py-5 hover:opacity-50 duration-300',
                        !user && 'hidden'
                      )}
                      onClick={handleCreateChat}
                      disabled={isSubmitting || chats.length <= 0}
                    >
                      New Room <AiOutlinePlus className="text-white/40" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </>
  );
};
