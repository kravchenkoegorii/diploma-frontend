import { create } from 'zustand';
import { IChat } from '../types/chat';

export interface IChatsStore {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;

  isSettingChatId: boolean;
  setIsSettingChatId: (isSettingChatId: boolean) => void;

  isTransactionSubmitting: boolean;
  setIsTransactionSubmitting: (isLastTransactionSuccess: boolean) => void;

  selectedChat: IChat | null;
  setSelectedChat: (chat: IChat | null) => void;

  newMessage: string;
  setNewMessage: (message: string) => void;

  hasFinishedTyping: boolean;
  setHasFinishedTyping: (isFinished: boolean) => void;

  isOpenedChatItemModal: boolean;
  setIsOpenedChatItemModal: (isOpened: boolean) => void;

  openAccordion: null | string;
  setOpenAccordion: (open: null | string) => void;

  animatedMessageId: string;
  setAnimatedMessageId: (id: string) => void;
}

export const chatsStore = create<IChatsStore>(set => ({
  animatedMessageId: '',
  setAnimatedMessageId: (id: string) => set(() => ({ animatedMessageId: id })),

  isSettingChatId: false,
  setIsSettingChatId: isSettingChatId => set({ isSettingChatId }),

  hasFinishedTyping: true,
  setHasFinishedTyping: (isFinished: boolean) =>
    set(() => ({ hasFinishedTyping: isFinished })),

  isOpenedChatItemModal: false,
  setIsOpenedChatItemModal: (isOpened: boolean) =>
    set(() => ({ isOpenedChatItemModal: isOpened })),

  openAccordion: null,
  setOpenAccordion: (open: null | string) =>
    set(() => ({ openAccordion: open })),

  isSubmitting: false,
  setIsSubmitting: (isSubmitting: boolean) =>
    set(state => ({ ...state, isSubmitting })),

  selectedChat: null,
  setSelectedChat: (chat: IChat | null) =>
    set(state => ({ ...state, selectedChat: chat })),

  newMessage: '',
  setNewMessage: (message: string) =>
    set(state => ({ ...state, newMessage: message })),

  isTransactionSubmitting: false,
  setIsTransactionSubmitting: (isLastTransactionSuccess: boolean) => {
    set(state => ({
      ...state,
      isTransactionSubmitting: isLastTransactionSuccess,
    }));
  },
}));

export const useChatsStore = chatsStore;
