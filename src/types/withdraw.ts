import { Address } from 'viem';
import { TChainId } from './chain';

export enum IWithdrawAction {
  CL = 'withdrawCL',
  AMM = 'withdrawAMM',
}

export interface IWithdraw {
  success: boolean;
  toAddress: Address;
  poolAddress: Address;
  tokenId: string;
  liquidity: bigint;
  amount0Min: bigint;
  amount1Min: bigint;
  token0: Address;
  token1: Address;
  stable: boolean;
  deadline: bigint;
  feeETH: string;
  action: IWithdrawAction;
  nfpm?: Address;
  chainId: TChainId;
}
