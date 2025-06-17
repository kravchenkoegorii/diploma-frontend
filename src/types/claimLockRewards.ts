import { Address } from 'viem';
import { TChainId } from './chain';

export interface IClaimLockRewards {
  action: 'claimLockRewards';
  chainId: TChainId;
  feeBn: string;
  isSimulation: boolean;
  lockIds: string[];
  success: boolean;
  walletAddress: Address;
}
