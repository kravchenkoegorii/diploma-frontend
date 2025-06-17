import { TChainId } from '@/types/chain';
import { Address } from 'viem';

export type ChartToken = {
  name: string;
  value: number;
  color: string;
  chainId: TChainId;
  token_address: Address;
};
