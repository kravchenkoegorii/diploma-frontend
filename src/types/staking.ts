import { Address } from 'viem';
import { EActionType } from './chat';
import { TChainId } from './chain';

export interface IStake {
  success: boolean;
  action?: EActionType.STAKE;
  isSimulation: boolean;
  walletAddress: Address;
  lpToken: Address;
  amountToApproveBN: bigint;
  amountBN: string;
  isClPool: boolean;
  feeBn: bigint;
  gauge: Address;
  tokenId: string;
  nfpm: Address;
  chainId: TChainId;
}
