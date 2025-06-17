import { Address } from 'viem';

export interface IUser {
  id: string;
  email: string;
  phone: string;
  wallets: {
    address: Address;
    createdAt: string;
    id: string;
    isDefault: boolean;
    updatedAt: string;
  }[];
  settings: {
    shouldExecuteActionsWithoutConfirmation: boolean;
  };
}

export interface IWalletBalances {
  ethBalance: number;
  usdcBalance: number;
}

export interface ITransaction {
  txHash: string;
  type: string;
  symbol: string;
  amount: number;
  amountUsd: number;
  timestamp: number;
}

export interface IAerodromeSummary {
  profits: number;
  profits24hAgo: number;
  staked: number;
  stakedReward: number;
  totalDeposited24hAgo: number;
  totalDepositedCurrent: number;
  tradingFee: number;
  unstaked: number;
  votingReward: number;
}
