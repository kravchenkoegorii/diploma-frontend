import { Address } from 'viem';
import { TChainId } from './chain';

export type IWithdrawLock = {
  walletAddress: Address;
  feeBn: bigint;
  lockId: string;
  success: boolean;
  chainId: TChainId;
};
