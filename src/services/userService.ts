import { mutate } from 'swr';
import { $api } from '.';
import { chatsStore } from '../stores/chats';
import { userStore } from '../stores/user';
import { IUser, IWalletBalances } from '../types/user';
import { disconnect, getBalance, multicall } from 'wagmi/actions';
import { wagmiConfig } from '../config/wagmiConfig';
import { Address, erc20Abi, formatUnits } from 'viem';
import { IWalletBalancesExtended } from '@/types/aerodrome';
import { ITransactionHistory } from '@/types/transactions';

export class UserService {
  async getUser() {
    const { setUserData, setIsLoadingUserData } = userStore.getState();

    try {
      const url = '/api/users';
      const { data } = await $api.get<IUser>(url);
      setUserData(data);

      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingUserData(false);
    }
  }

  async updateUserSettings(shouldExecuteActionsWithoutConfirmation: boolean) {
    try {
      const url = '/api/users';
      const { data } = await $api.patch<IUser>(url, {
        shouldExecuteActionsWithoutConfirmation,
      });

      return data;
    } catch (error) {
      console.error('Error during update user settings:', error);
    }
  }

  async registerUser() {
    userStore.setState({ isLoadingUserData: true });
    const url = '/api/auth/register';
    const { data } = await $api.post<IUser>(url);
    await this.getUser();
    return data;
  }

  async logOut() {
    const { setUserData } = userStore.getState();
    const { selectedChat, setSelectedChat } = chatsStore.getState();
    await mutate(`/chats/${selectedChat?.id}`, () => null);
    setUserData(null);
    setSelectedChat(null);
    await disconnect(wagmiConfig);
    await mutate('/chats', () => []);
    await mutate('/messages/limits');
  }

  async getBalances(account?: Address): Promise<IWalletBalances | undefined> {
    if (!account) {
      return;
    }

    const nativeBalance = await getBalance(wagmiConfig, {
      address: account,
    });

    const USDC = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

    const results = await multicall(wagmiConfig, {
      contracts: [
        {
          address: USDC,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [account],
        },
        {
          address: USDC,
          abi: erc20Abi,
          functionName: 'decimals',
        },
      ],
    });

    return {
      ethBalance: +formatUnits(nativeBalance.value, nativeBalance.decimals),
      usdcBalance:
        results[0].result !== undefined && results[1].result !== undefined
          ? +formatUnits(results[0].result, results[1].result)
          : 0,
    };
  }

  async getTransactions(
    walletAddress: string,
    page = 0,
    limit = 10,
    chainIds: number | number[]
  ) {
    try {
      const chainsParams = Array.isArray(chainIds)
        ? chainIds.join('&chains=')
        : chainIds;

      const url = `/api/transaction-history/transactions?walletAddress=${walletAddress}&limit=${limit}&page=${page}&chains=${chainsParams}`;
      const { data } = await $api.get<ITransactionHistory>(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      return {
        transactions: data.transactions || [],
        total: data.total || 0,
        currentPage: data.page || 0,
      };
    } catch (error) {
      console.error('Error during get txs', error);
      return { transactions: [], total: 0, currentPage: 0 };
    }
  }

  async loadMoreTransactions(
    walletAddress: string,
    currentPage: number,
    limit = 10,
    chainIds: number | number[]
  ) {
    return await this.getTransactions(
      walletAddress,
      currentPage + 1,
      limit,
      chainIds
    );
  }

  async getDexPositionsSummary(walletAddress: Address, chains: number[]) {
    try {
      const url = `/api/dex/positions/summary`;
      const { data } = await $api.post(
        url,
        { walletAddress, chains },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      return data;
    } catch (error) {
      console.error('Error fetching DEX positions summary:', error);
      return null;
    }
  }

  async getBalanceHistory(
    walletAddress: Address,
    interval: string,
    chainIds: number[]
  ) {
    try {
      const url = `/api/balances/history?walletAddress=${walletAddress}&interval=${interval}&chains=${chainIds.join('&chains=')}`;
      const { data } = await $api.get(url, {
        headers: {
          Accept: 'application/json',
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching balance history:', error);
      return [];
    }
  }

  async getWalletOverview(
    walletAddress: Address,
    chainIds: number[]
  ): Promise<IWalletBalancesExtended | null> {
    try {
      const url = `/api/balances/overview`;

      const { data } = await $api.get<IWalletBalancesExtended>(url, {
        params: {
          walletAddress,
          chains: chainIds,
        },
        headers: {
          Accept: 'application/json',
        },
      });

      return data;
    } catch (error) {
      console.error('Error fetching wallet overview:', error);
      return null;
    }
  }
}

export const userService = new UserService();
