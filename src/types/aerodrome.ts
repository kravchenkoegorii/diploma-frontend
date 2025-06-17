import { Address, ReadContractReturnType, TransactionReceipt } from 'viem';
import { sugarAbi } from '../abi';
import { veSugarAbi } from '../abis/veSugar.abi';
import { rewardsSugarAbi } from '../abis/rewardsSugar.abi';
import { TChainId } from './chain';

export type IPool = ReadContractReturnType<typeof sugarAbi, 'all'>[0];

export interface ILendingPool {
  alm: string;
  apr: string;
  bribe: string;
  dailyEmissionUsd: string;
  decimals: number;
  emissions: string;
  emissions_token: string;
  emissionsTokenSymbol: string;
  factory: string;
  fee: string;
  gauge: string;
  gauge_alive: boolean;
  gauge_liquidity: string;
  liquidity: bigint;
  lp: string;
  nfpm: string;
  pool_fee: string;
  reserve0: bigint;
  reserve1: bigint;
  reserveInUsd0: string;
  reserveInUsd1: string;
  root: string;
  sqrt_ratio: bigint;
  staked0: bigint;
  staked1: bigint;
  stakedInUsd0: string;
  stakedInUsd1: string;
  symbol: string;
  tick: number;
  token0: string;
  token0_fees: string;
  token1: string;
  token1_fees: string;
  tokenPrice0: string;
  tokenPrice1: string;
  tvl: string;
  type: number;
  unstaked_fee: string;
  volume: string;
  token0Symbol?: string;
  token1Symbol?: string;
  token0Decimals?: number;
  chainId: TChainId;
}

export interface ICommonPosition {
  chainId: TChainId;
}

export type TPosition = ReadContractReturnType<
  typeof sugarAbi,
  'positionsUnstakedConcentrated'
>[0] &
  ICommonPosition;

export interface IPosition extends TPosition {
  token0Symbol?: string;
  token0Decimals?: number;
  token1Symbol?: string;
  token1Decimals?: number;
  poolBalance0?: bigint;
  poolBalance1?: bigint;
  accountBalance0?: bigint;
  accountBalance1?: bigint;
  emissionsTokenSymbol?: string;
  emissionsTokenDecimals?: number;
  apr?: number;
}

export interface ICommonLock {
  chainId: TChainId;
}

export type TLock = ReadContractReturnType<typeof veSugarAbi, 'byAccount'>[0] &
  ICommonLock;

export type TVotingReward = ReadContractReturnType<
  typeof rewardsSugarAbi,
  'rewards'
>[0];

export interface IVotingReward extends TVotingReward {
  amount: bigint;
  bribe: Address;
  fee: Address;
  lp: Address;
  token: Address;
  token0_symbol: string;
  token1_symbol: string;
  token_decimals: number;
  token_symbol: string;
  venft_id: bigint;
  chainId: TChainId;
}

export interface ILpData {
  tokensData: [
    { result: string | number; status: 'success' | 'failure' },
    { result: string | number; status: 'success' | 'failure' },
    { result: number; status: 'success' | 'failure' },
    { result: number; status: 'success' | 'failure' },
  ];
  tickSpacing: number | null;
  token0: `0x${string}` | null;
  token1: `0x${string}` | null;
  balance1: {
    decimals: number;
    formatted: string;
    symbol: string;
    value: bigint;
  };
  balance2: {
    decimals: number;
    formatted: string;
    symbol: string;
    value: bigint;
  };
  reserve0: {
    decimals: number;
    formatted: string;
    symbol: string;
    value: bigint;
  };
  reserve1: {
    decimals: number;
    formatted: string;
    symbol: string;
    value: bigint;
  };
  feePercent: number | null;
  unstaked_earned0: string;
  unstaked_earned1: string;
}

export interface IEmissionPool {
  decimals: number;
}

export interface ISuperchainToken {
  symbol: string;
  totalAmount: number;
  totalUSD: number;
  token_logo: string | undefined;
  chains: {
    chainId: TChainId;
    amount: number;
    usdValue: number;
  }[];
}

export interface IToken {
  token_address: Address;
  symbol: string;
  decimals: number;
  account_balance: string;
  listed: boolean;
  price?: string;
}

export interface ITransaction {
  receipt: TransactionReceipt;
  chainId: TChainId;
}

export interface IWalletBalancesExtended {
  currentBalance: number;
  tokenQty: number;
  assets: {
    token_address: Address;
    symbol: string;
    price: string;
    tokenLogo: string;
    tokenName: string;
    amount: string;
    amountUSD: number;
    allocationPercent: number;
    decimals: number;
    pnl: number;
    chainId: TChainId;
  }[];
  previousBalance: 2.1782127168238654;
  previousAssets: {
    token_address: Address;
    symbol: string;
    price: string;
    tokenLogo: string;
    tokenName: string;
    amount: string;
    amountUSD: number;
    allocationPercent: number;
    decimals: number;
  }[];
}
