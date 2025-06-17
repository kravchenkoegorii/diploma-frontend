import { Address } from 'viem';
import { TChainId } from './chain';

export interface IPokeLock {
  success: boolean;
  action: string;
  isSimulation: boolean;
  chainId: TChainId;
  lockId: number;
  walletAddress: Address;
}
