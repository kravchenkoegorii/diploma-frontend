import { usePrivy } from '@privy-io/react-auth';
import random from 'lodash/random';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useShallow } from 'zustand/shallow';
import { WhiteArrow } from '../../assets/icons/WhiteArrow';
import { aiAvatar } from '../../assets/images';
import { LOGIN_MESSAGES } from '@/constants/ai.ts';
import { AnimatePresence, motion } from 'framer-motion';
import { CgSpinnerAlt } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import useSWR, { mutate, preload } from 'swr';
import { ROUTES } from '@/constants/routes.ts';
import { chatService } from '@/services/chatService.ts';
import { chatsStore, useChatsStore } from '@/stores/chats.ts';
import { EActionType, ESenderType, IChat } from '@/types/chat.ts';
import { Message } from './component/Message';
import { ChatsMenu } from './component/ChatsMenu';
import clsx from 'clsx';
import { MAX_MESSAGE_LENGTH } from '@/constants';
import { ScrollButton } from './component/ScrollButton';
import { BurgerIcon } from '@/assets/icons/BurgerIcon';
import { SpinnerIcon } from '@/assets/icons/SpinnerIcon';
import { ChatCooldown } from './component/ChatCooldown';
import agentBg from '@/assets/images/agentBg.png';
import agentTabletBg from '@/assets/images/agentTabletBg.png';
import { useAppStore } from '@/stores/app';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { SECOND } from '@/constants/time';
import { useChangeOrientationBlur } from '@/hooks/useChangeOrientationBlur';

const popularQuestions = [
  'Show me my balance',
  'What are my Aerodrome earnings?',
  'My liquidity positions',
  'What is Aerodrome?',
];

const ChatScreen = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useChangeOrientationBlur(textareaRef as RefObject<HTMLElement>);

  const { user, ready } = usePrivy();
  const hasFinishedTyping = useChatsStore(s => s.hasFinishedTyping);

  const [selectedChatId, isSettingChatId] = useChatsStore(
    useShallow(s => [s.selectedChat?.id, s.isSettingChatId])
  );

  const { data: chats, isLoading: isChatsLoading } = useSWR(
    user ? '/chats' : undefined,
    () => chatService.getChats(),
    {
      revalidateOnFocus: !!selectedChatId && !!user,
    }
  );

  const { data: selectedChat, isLoading: isChatLoading } = useSWR(
    `/chats/${selectedChatId}`,
    () =>
      selectedChatId
        ? chatService.getChat(selectedChatId)
        : chatsStore.getState().selectedChat,
    {
      revalidateOnFocus: !!selectedChatId && !!user,
      revalidateIfStale: !!selectedChatId && !!user,
    }
  );

  const { data: limits, isLoading: isLimitsLoading } = useSWR(
    '/messages/limits',
    () => chatService.getLimits()
  );

  const isLoading =
    !ready ||
    (user && isChatsLoading) ||
    isChatLoading ||
    (user && isLimitsLoading) ||
    isSettingChatId;

  const [isSubmitting, isTransactionSubmitting] = useChatsStore(
    useShallow(s => [s.isSubmitting, s.isTransactionSubmitting])
  );

  const [newMessage, setNewMessage] = useChatsStore(
    useShallow(s => [s.newMessage, s.setNewMessage])
  );

  const shouldForceLogin = useMemo(() => {
    return (
      selectedChat?.messages?.[selectedChat.messages.length - 1]?.actionType ===
        EActionType.LOGIN && !user
    );
  }, [selectedChat, user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      textareaRef.current?.focus();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = async (message: string, clearState = false) => {
    if (
      isSubmitting ||
      !message.trim() ||
      message.length > MAX_MESSAGE_LENGTH + 1
    ) {
      return;
    }

    const { setIsSubmitting, setSelectedChat, setNewMessage } =
      chatsStore.getState();
    setIsSubmitting(true);
    try {
      if (!user) {
        const { selectedChat } = chatsStore.getState();
        if (selectedChat) {
          return;
        }
        const guestChat = {
          id: `guest-${crypto.randomUUID()}`,
          title: 'Guest room',
          messages: [
            {
              id: crypto.randomUUID(),
              content: message,
              senderType: ESenderType.USER,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setSelectedChat(guestChat);
        setNewMessage('');

        await new Promise(resolve => setTimeout(resolve, SECOND));

        const loginMessageIndex = random(0, LOGIN_MESSAGES.length - 1);
        chatService.addMessage(
          guestChat.id,
          LOGIN_MESSAGES[loginMessageIndex],
          ESenderType.AI,
          undefined,
          EActionType.LOGIN
        );
        localStorage.setItem(STORAGE_KEYS.GUEST_MESSAGE, message);
        localStorage.setItem(STORAGE_KEYS.GUEST_MESSAGE_ID, guestChat.id);
      } else {
        if (clearState) {
          setNewMessage('');
        }

        let chat = selectedChat;
        if (!chat) {
          const modifiedChat: IChat = {
            id: crypto.randomUUID(),
            title: `Room ${(chats?.length || 0) + 1}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [
              {
                id: crypto.randomUUID(),
                content: message,
                senderType: ESenderType.USER,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          };
          preload(`/chats/${undefined}`, () => modifiedChat);
          await mutate(`/chats/${undefined}`, () => modifiedChat, {
            optimisticData: () => modifiedChat,
            revalidate: false,
          });
          chat = await chatService.createChat(
            `Room ${(chats?.length || 0) + 1}`,
            false
          );

          preload(`/chats/${chat.id}`, () => modifiedChat);
          setSelectedChat({
            ...modifiedChat,
            id: chat.id,
          });
        }
        await chatService.sendMessage(chat.id, message);

        if ((chat?.messages?.length ?? 0) <= 0) {
          await mutate('/chats');
          await mutate(`/chats/${chat.id}`);
        }
        preload(`/chats/${undefined}`, () => undefined);
        await mutate(`/chats/${undefined}`, () => undefined, {
          optimisticData: () => undefined,
          populateCache: true,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const message = e.target.value;

    if (message.length > MAX_MESSAGE_LENGTH + 1) {
      return;
    }
    setNewMessage(message);
  };

  const isMessageLong = newMessage.length >= 190;
  const isMessageTooLong = newMessage.length >= MAX_MESSAGE_LENGTH + 1;

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const preventScroll = (e: Event) => {
      if (isFocused) {
        e.preventDefault();
      }
    };

    window.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isScrolled = useAppStore(s => s.isScrolled);
  const [openAccordion, setOpenAccordion] = useChatsStore(
    useShallow(s => [s.openAccordion, s.setOpenAccordion])
  );
  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accordionRef.current &&
        !accordionRef.current.contains(event.target as Node)
      ) {
        setOpenAccordion(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={clsx(
        'h-full max-992px:pt-0 max-1200px:p-0 px-[30px] transition-all',
        isScrolled && 'max-992px:mt-[46px]',
        !isScrolled && 'max-992px:mt-[108px]'
      )}
    >
      <div
        className={clsx(
          `relative flex flex-col min-992px:flex-row justify-between max-1400px:items-start items-center min-1200px:items-start max-1200px:pb-8 py-6 max-1200px:pt-4 min-1200px:px-6 px-4 min-992px:px-5 gap-4 min-1200px:gpa-8 min-1200px:gap-8 max-1200px:h-[calc(100svh_-_140px)] max-992px:mt-0 max-1200px:mt-4 min-1200px:h-[calc(100svh_-_152px)] border-[0.5px] border-white/10 rounded-[23px] max-992px:backdrop-blur-0 max-1200px:border-0 transition-all`,
          isScrolled && 'max-992px:h-[calc(100svh_-_46px)] max-992px:pt-4',
          !isScrolled && 'max-992px:h-[calc(100svh_-_108px)] max-992px:pt-4'
        )}
      >
        <div
          style={{
            backgroundImage: `url(${agentBg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
          className="absolute inset-0 max-1200px:rounded-[0] rounded-[23px] max-1400px:hidden"
        />
        <div
          style={{
            backgroundImage: `url(${agentTabletBg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
          className="absolute inset-0 z-[-999] max-1200px:rounded-none rounded-[23px] min-1400px:hidden"
        />
        <div className="z-[999] h-full max-992px:w-full flex flex-col justify-between">
          {!isChatsLoading && chats ? (
            <div className="flex max-992px:flex-row flex-col gap-2 max-992px:w-full max-1400px:w-[267px] w-[268px] max-h-[200px] md:max-h-none text-[#fff]">
              {!user && (
                <div
                  style={{ border: '.5px solid #FFFFFF1A' }}
                  className="w-full rounded-3xl disabled:opacity-50 disabled:pointer-events-none cursor-pointer truncate px-[1.625rem] py-[20px] leading-[14.4px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  Guest Room
                </div>
              )}
              {user && (
                <div className="flex justify-between w-full">
                  <ChatsMenu
                    chats={chats}
                    user={user}
                    isSubmitting={isSubmitting}
                    selectedChat={selectedChat}
                    openAccordion={openAccordion}
                    setOpenAccordion={setOpenAccordion}
                    onMessageSelect={handleSubmit}
                  />
                </div>
              )}
            </div>
          ) : user ? (
            <div className="min-w-[268px] hidden min-992px:flex text-white items-center h-[200px] justify-center">
              {isChatsLoading && <CgSpinnerAlt className="animate-spin " />}
            </div>
          ) : null}
        </div>

        <div className="max-1200px:justify-between flex flex-col grow w-full max-w-[735px] mx-auto max-992px:h-[calc(100%_-_3.75rem)] h-full">
          {!isLoading &&
            !isChatLoading &&
            (selectedChat?.messages?.length || 0) <= 0 && (
              <div className="z-[1] flex flex-col items-center max-h-full h-screen text-[#fff] overflow-auto scrollbar-hidden pt-[1.625rem] min-1200px:pt-[3.5rem]">
                <img
                  src={aiAvatar}
                  alt="ai-image"
                  className="max-1400px:mb-[20px] max-992px:mb-[20px] mb-[60px] max-992px:w-[80px] max-992px:h-[80px] w-[94px] h-[94px]"
                />
                <h1 className="max-1400px:text-[40px] max-992px:leading-[20px] leading-[62.7px] max-992px:text-[20px] text-[57px] font-radio max-1400px:mb-5 max-992px:mb-[1.0625rem] mb-[1.625rem]">
                  What would you like to know?
                </h1>
                <h6 className="leading-[19.8px] max-1400px:text-[15px] max-992px:text-[15px] text-[18px] text-[#C9C9E2] max-w-[718px] mx-auto text-center max-1400px:mb-[20px] mb-[1.875rem]">
                  gm, I'm Crypto AI! As your personal companion, I’m here to
                  simplify your journey through Aerodrome. I streamline every
                  step for maximum efficiency. Whether you’re new or a seasoned
                  trader, I’m your trusted guide to mastering DeFi on Aerodrome
                  with ease and precision.
                </h6>
                <Link
                  to={ROUTES.FAQ}
                  className="flex items-center gap-[6px] max-992px:mb-[1.875rem] mb-[66px] hover:opacity-50 transition duration-300"
                >
                  Visit FAQ Section <WhiteArrow />
                </Link>
              </div>
            )}

          {!isLoading &&
            !isChatLoading &&
            (selectedChat?.messages?.length || 0) > 0 && (
              <ScrollToBottom
                key={selectedChat?.id}
                initialScrollBehavior="auto"
                className="chat-scroll-container max-h-max  max-992px:pl-4 min-1200px:max-h-max overflow-y-auto chat-scroll rounded-r-2xl min-1200px:rounded-none"
              >
                <div className="flex flex-col gap-6 max-992px:mx-0 tablet:pr-0 px-[40px] max-992px:pr-4 grow pb-8 pt-[1.875rem] overflow-x-hidden">
                  {(selectedChat?.messages?.length || 0) <= 0 && (
                    <div className="text-gray-500">No messages yet</div>
                  )}
                  {(selectedChat?.messages?.length || 0) > 0 &&
                    selectedChat?.messages?.map(message => (
                      <Message key={message.id} message={message} />
                    ))}
                  {selectedChat?.messages?.[selectedChat?.messages.length - 1]
                    ?.senderType === ESenderType.USER &&
                    (isSubmitting || isTransactionSubmitting) && (
                      <div className="p-2 text-sm flex gap-2 text-gray-500">
                        {isSubmitting && <span>Crypto AI is thinking</span>}
                        {isTransactionSubmitting && (
                          <span>Crypto AI is processing your transaction</span>
                        )}
                        <div className="py-[10px] w-[50px] h-[20px] bg-[#403832]/100 backdrop-blur-xl flex gap-[5px] items-center justify-center rounded-[23px] ">
                          {Array(3)
                            .fill(0)
                            .map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{
                                  opacity: [0, 1, 0],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                                className="min-w-[7px] min-h-[7px] rounded-full bg-gray-400 "
                              ></motion.div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
                <ScrollButton />
              </ScrollToBottom>
            )}

          {(isLoading || isChatLoading || isChatsLoading) && (
            <div className="flex items-center justify-center text-white text-4xl mt-[26px]">
              <CgSpinnerAlt className="animate-spin " />
            </div>
          )}
          <div className="flex flex-col tablet:gap-0 gap-2 mt-auto max-992px:mt-0 mb-0 w-full relative">
            <AnimatePresence>
              {isMessageTooLong && (
                <motion.div
                  initial={{ opacity: 0, y: '-30%', x: '-50%' }}
                  animate={{ opacity: 1, y: 'calc(-100% + 1rem)', x: '-50%' }}
                  exit={{ opacity: 0, y: '-30%', x: '-50%' }}
                  className="absolute text-[#f5020b] text-center w-full left-1/2 -translate-x-1/2 -translate-y-[calc(100%_-_1rem)] pt-5 pb-5 "
                >
                  Limit for one message is 200 symbols
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {limits?.isBlocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: -8 }}
                  animate={{
                    opacity: 1,
                    height: 38,
                    marginBottom: 0,
                  }}
                  exit={{ opacity: 0, height: 0, marginBottom: -8 }}
                  className="min-1200px:hidden text-white bg-[#17171729] px-4 w-full flex flex-col gap-2 h-max p-1.5 border border-solid border-white/10 rounded-2xl overflow-hidden"
                >
                  You met with message limits for time period.
                </motion.div>
              )}
            </AnimatePresence>
            <label
              className={clsx(
                'relative z-[1] border border-solid flex gap-2 max-992px:bg-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.07)] rounded-2xl max-992px:mb-0 max-1200px:mb-3 mb-6 max-h-[68px] h-[68px] px-[1.625rem] overflow-hidden',
                isMessageTooLong
                  ? ' border-[1px] border-[#f5020b]'
                  : 'border-transparent',
                limits?.isBlocked && '!bg-[#17171729] pointer-events-none'
              )}
            >
              {limits?.isBlocked && (
                <div className="hidden sm:flex items-center gap-4 text-[#C9C9E299] whitespace-nowrap overflow-hidden">
                  <BurgerIcon />
                  You met with message limits for time period.
                </div>
              )}
              {!limits?.isBlocked && (
                <textarea
                  ref={textareaRef}
                  disabled={
                    isSubmitting ||
                    shouldForceLogin ||
                    isLoading ||
                    limits?.isBlocked ||
                    !hasFinishedTyping
                  }
                  style={{ caretColor: '#fff' }}
                  className="px-0 bg-[transparent] text-[#C9C9E2] font-radio placeholder-[#C9C9E2] pt-[22px] resize-none focus:outline-none input-scroll w-full align-middle"
                  rows={1}
                  placeholder={
                    shouldForceLogin
                      ? 'You should log in...'
                      : 'Write your message...'
                  }
                  value={newMessage}
                  onChange={handleMessageChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (newMessage.trim().length > 0) {
                        handleSubmit(newMessage, true);
                      }
                    }
                  }}
                ></textarea>
              )}
              {limits?.isBlocked && (
                <ChatCooldown expiresIn={Date.now() + limits.limitResetInMs} />
              )}
              {isMessageLong && (
                <span
                  className={clsx(
                    'absolute right-4 text-xs',
                    isMessageTooLong ? 'text-[#f5020b]' : 'text-gray-500'
                  )}
                >
                  {newMessage.length}/{MAX_MESSAGE_LENGTH}
                </span>
              )}
              {limits?.isBlocked && (
                <div className="flex items-center justify-center ml-2 text-white">
                  <SpinnerIcon className="animate-spin" />
                </div>
              )}
              {!limits?.isBlocked && !shouldForceLogin && (
                <button
                  disabled={
                    isSubmitting ||
                    newMessage.length === 0 ||
                    isChatLoading ||
                    isLoading ||
                    !hasFinishedTyping
                  }
                  className="flex items-center gap-[6px] text-white rounded-full transition-opacity duration-300 hover:opacity-75 disabled:opacity-50 disabled:pointer-events-none font-radio cursor-pointer"
                  onClick={() => handleSubmit(newMessage, true)}
                >
                  Send <WhiteArrow />
                </button>
              )}
            </label>
            <div className="flex max-992px:flex-wrap justify-center gap-[10px]">
              {popularQuestions?.map((item, index) => (
                <button
                  key={index}
                  disabled={
                    isSubmitting ||
                    isChatLoading ||
                    isLoading ||
                    !hasFinishedTyping ||
                    shouldForceLogin
                  }
                  className="block max-992px:py-[5px] max-992px:leading-0 max-992px:text-[10px] py-[9px] max-992px:px-[5px] px-4 border-[0.5px] border-solid border-white/10 min-1200px:backdrop-blur-sm bg-[#171717]/5 text-[#fff] rounded-2xl text-[12px] leading-[13.2px] cursor-pointer active:opacity-50 2xl:hover:opacity-50 transition-all duration-150 2xl:duration-300 disabled:pointer-events-none"
                  onClick={() => handleSubmit(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
