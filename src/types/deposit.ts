import { Address } from 'viem';
import { TChainId } from './chain';

export interface ICommonDeposit {
  chainId: TChainId;
}

export interface IDeposit extends ICommonDeposit {
  isSimulation: boolean;
  actionType: string;
  tokenA: Address;
  tokenB: Address;
  stable: boolean;
  amountADesired: unknown;
  amountBDesired: unknown;
  amountADesiredBN: bigint;
  amountBDesiredBN: bigint;
  amountAMin: unknown;
  amountBMin: unknown;
  amountAMinBN: bigint;
  amountBMinBN: bigint;
  amountAToApproveBN: bigint;
  amountBToApproveBN: bigint;
  to: unknown;
  deadline: unknown;
  feeAmount: unknown;
  value: bigint;
  fromAddress: unknown;
  feeBn: bigint;
}

export interface IDepositETH extends ICommonDeposit {
  isSimulation: boolean;
  actionType: string;
  token: Address;
  amountToApproveBN: bigint;
  stable: unknown;
  amountTokenDesired: unknown;
  amountTokenMin: unknown;
  amountETHMin: unknown;
  to: unknown;
  deadline: unknown;
  feeAmount: unknown;
  value: bigint;
}

export interface IDepositMint extends ICommonDeposit {
  actionType: string;
  amount0Desired: unknown;
  amount0Min: unknown;
  amount1Desired: unknown;
  amount1Min: unknown;
  amountAToApproveBN: bigint;
  amountBToApproveBN: bigint;
  amountIn: unknown;
  amountInUsd: unknown;
  amountOut: unknown;
  amountOutUsd: unknown;
  deadline: unknown;
  fee: unknown;
  feeAmount: unknown;
  feeUsd: unknown;
  isSimulation: boolean;
  pool: unknown;
  recipient: unknown;
  sqrtPriceX96: unknown;
  success: boolean;
  tickLower: unknown;
  tickSpacing: unknown;
  tickUpper: unknown;
  token0: Address;
  token0Symbol: unknown;
  token1: Address;
  token1Symbol: unknown;
  value: bigint;
}
