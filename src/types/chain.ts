import { Address } from 'viem';

export interface IChain {
  chainId: number;
  veSugar: string;
  votingEscrow: Address;
  chain: any;
  sugarContract: Address;
}

export type TChainId =
  | 8453
  | 10
  | 252
  | 57073
  | 1135
  | 1750
  | 34443
  | 1868
  | 5330
  | 1923
  | 130
  | 42220;
