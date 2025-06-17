import { Address } from 'viem';
import { TChainId } from './chain';

export interface IResetLock {
  success: boolean;
  action: string;
  isSimulation: boolean;
  chainId: TChainId;
  walletAddress: Address;
  lockId: number;
}
