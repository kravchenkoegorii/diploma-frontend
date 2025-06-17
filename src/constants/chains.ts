import { baseIcon, optimismIcon } from '@/assets/images';
import { TChainId } from '@/types/chain';
import { base, optimism } from 'viem/chains';

interface IChain {
  id: TChainId | -1;
  title: string;
  image?: string;
}

export const chains: IChain[] = [
  {
    id: -1,
    title: 'Superchain',
  },
  {
    id: optimism.id,
    title: 'OP Mainnet',
    image: optimismIcon,
  },
  {
    id: base.id,
    title: 'Base',
    image: baseIcon,
  },
];
