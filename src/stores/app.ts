import { IToken } from '@/types/aerodrome';
import { TChainId } from '@/types/chain';
import { Address } from 'viem';
import { create } from 'zustand';

interface IAppStore {
  isScrolled: boolean;
  setIsScrolled: (isScrolled: boolean) => void;
  currentTime: number;
  tokens?: Record<Address, IToken>;
  currentChain: {
    title: string;
    id: TChainId | -1;
    image?: string;
  };
  setCurrentChain: (chain: {
    title: string;
    id: TChainId | -1;
    image?: string;
  }) => void;

  setTokens(tokens: Record<Address, IToken>): void;
}

export const appStore = create<IAppStore>(set => ({
  currentTime: Date.now(),
  tokens: undefined,
  setTokens: tokens => set({ tokens }),
  isScrolled: false,
  setIsScrolled: isScrolled => set(state => ({ ...state, isScrolled })),
  currentChain: {
    title: 'Superchain',
    id: -1,
  },
  setCurrentChain: chain => set({ currentChain: chain }),
}));

export const useAppStore = appStore;
