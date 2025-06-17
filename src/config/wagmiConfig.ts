import { base, optimism } from 'viem/chains';
import { createConfig } from '@privy-io/wagmi';
import { fallback, http } from 'wagmi';
import { VIEM_RPC_URLS } from '@/constants/chain';

export const wagmiConfig = createConfig({
  chains: [base, optimism],
  transports: {
    [base.id]: fallback(VIEM_RPC_URLS[base.id].map(el => http(el))),
    [optimism.id]: fallback(VIEM_RPC_URLS[optimism.id].map(el => http(el))),
  },
});
