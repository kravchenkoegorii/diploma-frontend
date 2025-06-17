import { Address } from 'viem';
import { TChainId } from './chain';

export interface IVote {
  success: boolean;
  pools: Address[];
  poolsNames: string[];
  poolsPowers: string[];
  amount: string;
  tokenId: bigint;
  powers: bigint[];
  chainId: TChainId;
}
