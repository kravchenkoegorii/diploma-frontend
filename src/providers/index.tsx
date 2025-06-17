'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { PrivyClientConfig } from '@privy-io/react-auth';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { base } from 'viem/chains';
import { wagmiConfig } from '../config/wagmiConfig';
import { aiAvatar } from '@/assets/images';

const queryClient = new QueryClient();

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: false,
    showWalletUIs: false,
  },
  loginMethods: ['email', 'google', 'twitter', 'telegram', 'wallet'],
  appearance: {
    showWalletLoginFirst: false,
    theme: 'dark',
    logo: aiAvatar,
  },
  supportedChains: wagmiConfig.chains.map(chain => chain),
  defaultChain: base,
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID || ''}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          <TooltipProvider>{children}</TooltipProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
