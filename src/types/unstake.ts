import { Address } from 'viem';
import { TChainId } from './chain';

export interface IUnstake {
  success: boolean;
  action: string;
  isSimulation: boolean;
  walletAddress: Address;
  isAlmPool: boolean;
  isClPool: boolean;
  lpToken: Address;
  amountBn: bigint;
  amountToApproveBn: bigint;
  feeBn: string;
  gauge: Address;
  tokenId: bigint;
  nfpm: Address;
  chainId: TChainId;
}
