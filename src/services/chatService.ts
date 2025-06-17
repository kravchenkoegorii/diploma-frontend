import { getAccessToken } from '@privy-io/react-auth';
import isObject from 'lodash/isObject';
import { $api, API_URL } from '.';
import { chatsStore } from '../stores/chats';
import {
  EActionType,
  ESenderType,
  ETxMessageType,
  IChat,
  IMessage,
  IMessageLimits,
  IMessageWithAction,
} from '../types/chat';
import { aerodromeService } from './aerodromeService';
import { mutate, preload } from 'swr';
import toast from 'react-hot-toast';
import { ISwap } from '@/types/swap';
import { IDeposit } from '@/types/deposit';
import { IWithdraw } from '@/types/withdraw';
import { IStake } from '@/types/staking';
import { IUnstake } from '@/types/unstake';
import { IClaimTradingFee } from '@/types/claimTradingFee';
import { IClaimEmissionFee } from '@/types/claimEmissionFee';
import {
  ICreateLock,
  IExtendLock,
  IIncreaseLock,
  IMergeLocks,
  ISetLockToRaley,
  ITransferLock,
} from '@/types/lock';
import { IVote } from '@/types/votes';
import { IWithdrawLock } from '@/types/withdrawLock';
import { ITransaction } from '@/types/aerodrome';
import { IClaimVotingReward } from '@/types/claimVotingRewards';
import { IClaimLockRewards } from '@/types/claimLockRewards';
import { IResetLock } from '@/types/resetLock';
import { IPokeLock } from '@/types/pokeLock';

export class ChatService {
  async getChats(selectChat = false) {
    const url = '/api/chats';
    const { data } = await $api.get<IChat[]>(url);

    const { selectedChat, setSelectedChat, setIsSettingChatId } =
      chatsStore.getState();

    if (!selectedChat && data.length && selectChat) {
      setIsSettingChatId(true);
      const newSelectedChat = await this.getChat(data[0].id);
      preload(`/chats/${data[0].id}`, () => newSelectedChat);
      await mutate(`/chats/${data[0].id}`, () => newSelectedChat);
      setSelectedChat(newSelectedChat);
      setIsSettingChatId(false);
    }

    return data;
  }

  async getChat(chatId?: string) {
    const { selectedChat } = chatsStore.getState();

    if (chatId?.startsWith('guest-') || !chatId) {
      return selectedChat;
    }

    const url = `/api/chats/${chatId}`;
    const { data } = await $api.get<IChat>(url);

    return data;
  }

  async getLimits() {
    const url = '/api/messages/limits';
    const { data } = await $api.get<IMessageLimits>(url);

    return data;
  }

  async createChat(
    title: string,
    shouldSelectAfterCreate = true,
    fetchChats = true
  ) {
    const url = '/api/chats';
    const { data } = await $api.post<IChat>(url, { title });

    if (shouldSelectAfterCreate) {
      const { setSelectedChat } = chatsStore.getState();
      setSelectedChat(data);
    }

    if (fetchChats) await mutate('/chats', () => this.getChats(false));

    return data;
  }

  async updateChat(chatId: string | undefined, title: string) {
    if (!chatId) {
      return;
    }
    await mutate(
      '/chats',
      async () => {
        const url = `/api/chats`;
        await $api.patch<IChat>(url, { chatId, title });
        return await this.getChats();
      },
      {
        optimisticData: (currentData: IChat[] | undefined) => {
          return (currentData || []).map(chat =>
            chat.id === chatId ? { ...chat, title } : chat
          );
        },
        rollbackOnError: true,
      }
    );
  }

  async deleteChat(chatId: string | undefined) {
    if (!chatId) {
      return;
    }
    const url = `/api/chats`;
    const { setSelectedChat } = chatsStore.getState();
    const chats = await mutate(
      '/chats',
      async () => {
        await $api.delete(url, {
          data: { chatId },
        });
        return await this.getChats();
      },
      {
        optimisticData: (currentData: IChat[] | undefined) => {
          const chats = (currentData || []).filter(chat => chat.id !== chatId);

          if (chats.length) {
            setSelectedChat(chats[0]);
          } else {
            setSelectedChat(null);
          }

          return chats;
        },
        populateCache: true,
        rollbackOnError: true,
        revalidate: false,
      }
    );

    if (chats?.length) {
      setSelectedChat(chats[0]);
    } else {
      setSelectedChat(null);
    }
  }

  async addMessage(
    chatId: string,
    content: string,
    senderType: ESenderType,
    messageId?: string,
    actionType?: EActionType
  ) {
    const { setAnimatedMessageId } = chatsStore.getState();
    const id = messageId || crypto.randomUUID();
    const newMessage: IMessage = {
      id,
      content,
      senderType,
      actionType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (senderType === ESenderType.AI) {
      setAnimatedMessageId(id);
    }
    return await mutate(
      `/chats/${chatId}`,
      (chat: IChat | undefined) =>
        chat
          ? { ...chat, messages: [...(chat.messages || []), newMessage] }
          : undefined,
      {
        optimisticData: (currentData: IChat | undefined) => {
          const chat = currentData;
          return {
            id: chat?.id || chatId,
            title: chat?.title || '',
            createdAt: chat?.createdAt || new Date().toISOString(),
            updatedAt: chat?.updatedAt || new Date().toISOString(),
            ...chat,
            messages: [...(chat?.messages || []), newMessage],
          };
        },
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }

  async updateMessage(chatId: string, messageId: string, content: string) {
    return await mutate(
      `/chats/${chatId}`,
      (chat: IChat | undefined) => {
        if (!chat) {
          return chat;
        }
        const messages = chat.messages?.map(message =>
          message.id === messageId ? { ...message, content } : message
        );
        return { ...chat, messages };
      },
      {
        revalidate: false,
        optimisticData: (currentData: IChat | undefined) => {
          return {
            id: currentData?.id || chatId,
            title: currentData?.title || '',
            createdAt: currentData?.createdAt || new Date().toISOString(),
            updatedAt: currentData?.updatedAt || new Date().toISOString(),
            ...currentData,
            messages: (currentData?.messages || []).map(message =>
              message.id === messageId ? { ...message, content } : message
            ),
          };
        },
      }
    );
  }

  async deleteMessage(chatId: string, messageId: string) {
    return await mutate(`/chats/${chatId}`, (chat: IChat | undefined) => {
      if (!chat) {
        return chat;
      }
      const messages = chat.messages?.filter(
        message => message.id !== messageId
      );
      return { ...chat, messages };
    });
  }

  async sendMessage(chatId: string | undefined, content: string) {
    if (!chatId) {
      return;
    }
    const messageId = crypto.randomUUID();
    this.addMessage(chatId, content, ESenderType.USER, messageId);

    const accessToken = await getAccessToken();

    if (!accessToken) {
      return;
    }

    setTimeout(() => {
      const chatContainer = document.querySelector(
        '.chat-scroll-container > div'
      );
      chatContainer?.scrollTo({
        top: chatContainer.scrollHeight + 500,
        behavior: 'smooth',
      });
    }, 0);

    try {
      const url = (API_URL.endsWith('/') ? '' : '/') + `api/messages`;
      const response = await fetch(API_URL + url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify({
          chatId,
          content,
          senderType: ESenderType.USER,
        }),
      });

      if (!response.ok) {
        const json = await response.json();
        const message = json.message || 'Something went wrong';

        throw new Error(message);
      }

      mutate('/messages/limits');

      const reader = await response.body?.getReader();

      if (!reader) {
        return;
      }

      let result = await reader.read();
      let resultString = '';

      while (!result.done) {
        const message = new TextDecoder().decode(result.value);
        resultString += message;
        result = await reader.read();
      }

      let resultParsed: IMessageWithAction | string;
      try {
        resultParsed = JSON.parse(resultString);
      } catch {
        resultParsed = resultString;
      }

      if (isObject(resultParsed)) {
        if ('actionType' in resultParsed && 'data' in resultParsed) {
          const { actionType, data } = resultParsed;

          if (actionType === EActionType.SWAP) {
            aerodromeService.swapMultiple(data as ISwap[], chatId);
          }

          if (actionType === EActionType.WITHDRAW) {
            aerodromeService.withdrawMultiple(data as IWithdraw[], chatId);
          }

          if (actionType === EActionType.STAKE) {
            aerodromeService.stakeMultiple(data as IStake[], chatId);
          }

          if (actionType === EActionType.DLIQUIDITY) {
            aerodromeService.deposit(data as IDeposit[], chatId);
          }

          if (actionType === EActionType.UNSTAKE) {
            aerodromeService.unStakeMultiple(data as IUnstake[], chatId);
          }

          if (actionType === EActionType.LOCK_TOKENS) {
            aerodromeService.lockMultiple(data as ICreateLock[], chatId);
          }

          if (actionType === EActionType.VOTE) {
            aerodromeService.voteMultiple(data as IVote[], chatId);
          }

          if (actionType === EActionType.EXTEND_LOCK) {
            aerodromeService.extendLockMultiple(data as IExtendLock[], chatId);
          }

          if (actionType === EActionType.INCREASE_LOCK) {
            aerodromeService.increaseLockMultiple(
              data as IIncreaseLock[],
              chatId
            );
          }

          if (actionType === EActionType.SET_LOCK_TO_RELAY) {
            aerodromeService.setLockToRelayMultiple(
              data as ISetLockToRaley[],
              chatId
            );
          }

          if (actionType === EActionType.MERGE_LOCKS) {
            aerodromeService.mergeMultiple(data as IMergeLocks[], chatId);
          }

          if (actionType === EActionType.TRANSFER_LOCK) {
            aerodromeService.transferMultiple(data as ITransferLock[], chatId);
          }

          if (actionType === EActionType.CLAIM_VOTING_REWARDS) {
            aerodromeService.claimVotingRewardsMultiple(
              data as IClaimVotingReward[],
              chatId
            );
          }

          if (actionType === EActionType.WITHDRAW_LOCK) {
            aerodromeService.withdrawLockMultiple(
              data as IWithdrawLock[],
              chatId
            );
          }

          if (actionType === EActionType.CLAIM_LOCK_REWARDS) {
            aerodromeService.claimLockRewardsMultiple(
              data as IClaimLockRewards[],
              chatId
            );
          }

          if (actionType === EActionType.RESET_LOCK) {
            const resetLockData = Array.isArray(data)
              ? (data as IResetLock[])
              : [data as IResetLock];

            aerodromeService.resetLockMultiple(resetLockData, chatId);
          }

          if (actionType === EActionType.POKE_LOCK) {
            aerodromeService.pokeLockMultiple(data as IPokeLock[], chatId);
          }

          if (
            actionType === EActionType.CLAIM_TRADING_FEE ||
            actionType === EActionType.CLAIM_EMISSION_FEE ||
            actionType === EActionType.CLAIM_TRADING_AND_EMISSION_FEE
          ) {
            aerodromeService.claimTradingOrEmissionFeeMultiple(
              data as (IClaimTradingFee | IClaimEmissionFee)[],
              chatId
            );
          }
        }

        return response;
      } else {
        const chat = await this.addMessage(chatId, '', ESenderType.AI);
        const answerMessageId =
          chat?.messages[chat.messages.length - 1].id || crypto.randomUUID();

        const splitTextIntoPartsByFormulas = (input: string) => {
          const regex = /(\\\\\[.*?\\\\\])|(\\\\\(.*?\\\\\))/g;
          return input.split(regex).filter(part => part && part.trim() !== '');
        };

        const splittedMessage = splitTextIntoPartsByFormulas(
          JSON.stringify(resultString).slice(1, -1)
        );

        let msg = '';

        for (const part of splittedMessage) {
          if (
            part.includes('\\text') ||
            part.includes('\\times') ||
            part.includes('\\frac')
          ) {
            msg += ` ${part} `;
          } else {
            msg += part;
          }
        }

        await this.updateMessage(chatId, answerMessageId, msg);
      }

      return response;
    } catch (error) {
      this.deleteMessage(chatId, messageId);
      if (error instanceof Error) {
        mutate('/messages/limits');
        if (error.message.includes('ThrottlerException')) {
          return;
        }
        toast.error(error.message);
      }
    }
  }

  async sendTxMessage(
    chatId: string,
    transactions: ITransaction[],
    type: ETxMessageType = ETxMessageType.SWAP
  ) {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return;
    }

    const url = (API_URL.endsWith('/') ? '' : '/') + `api/messages/add-tx`;
    const response = await fetch(API_URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({
        chatId,
        transactions: transactions.map(tx => ({
          hash: tx.receipt.transactionHash,
          chainId: tx.chainId,
        })),
        type,
      }),
    });

    const reader = await response.body?.getReader();

    if (!reader) {
      return;
    }

    let result = await reader.read();
    let resultString = '';
    const messageId = crypto.randomUUID();

    await this.addMessage(chatId, '', ESenderType.AI, messageId);

    while (!result.done) {
      const message = new TextDecoder().decode(result.value);
      resultString += message;
      this.updateMessage(chatId, messageId, resultString);

      result = await reader.read();
    }

    return response;
  }

  async sendErrorMessage(chatId: string, error: string) {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return;
    }

    const url = (API_URL.endsWith('/') ? '' : '/') + `api/messages/error`;
    const response = await fetch(API_URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({
        chatId,
        error,
      }),
    });

    const reader = await response.body?.getReader();

    if (!reader) {
      return;
    }

    let result = await reader.read();
    let resultString = '';
    const messageId = crypto.randomUUID();

    await this.addMessage(chatId, '', ESenderType.AI, messageId);

    while (!result.done) {
      const message = new TextDecoder().decode(result.value);
      resultString += message;
      this.updateMessage(chatId, messageId, resultString);

      result = await reader.read();
    }

    return response;
  }
}

export const chatService = new ChatService();
