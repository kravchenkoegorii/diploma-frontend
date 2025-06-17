import { Address } from 'viem';
import { TChainId } from './chain';

export interface IClaimVotingReward {
  bribes: Address[];
  rewardTokens: Address[][];
  veNFTTokenId: bigint;
  feeBn?: bigint;
  walletAddress: Address;
  chainId: TChainId;
  success: boolean;
}
