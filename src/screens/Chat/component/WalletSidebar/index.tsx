import { useFundWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import * as Accordion from '@radix-ui/react-accordion';
import { useUserStore } from '../../../../stores/user';
import { formatAddress } from '../../../../utilities/formatAddress';
import { CopyButton } from '../../../../components/CopyButton';
import { ArrowUpRight } from '../../../../assets/icons/Arrow';
import { IoKeyOutline } from 'react-icons/io5';
import { base } from 'viem/chains';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { userService } from '../../../../services/userService';
import { Address } from 'viem';
import { formatNumber } from '../../../../utilities/number';
import { SendTransactionModal } from '@/components/SendTransactionModal';
import { CgSpinnerAlt } from 'react-icons/cg';
import { useAppStore } from '@/stores/app';
import { useShallow } from 'zustand/shallow';
import { chains } from '@/constants/chains';
import { TokenItem } from './components/TokenItem';
import { AnimatePresence, motion, useWillChange } from 'framer-motion';
import { SECOND } from '@/constants/time';

export const WalletSidebar = () => {
  const { wallets } = useWallets();
  const defaultWallet = useUserStore(
    s => s.userData?.wallets?.find(w => w.isDefault) ?? null
  );
  const { exportWallet, ready, user } = usePrivy();
  const { fundWallet } = useFundWallet();
  const currentChain = useAppStore(useShallow(s => s.currentChain));
  const isEmbeddedWallet = useMemo(() => {
    const wallet = wallets.find(w => w.address === defaultWallet?.address);
    return wallet?.walletClientType === 'privy';
  }, [wallets, defaultWallet]);

  const willChange = useWillChange();

  const [openParent, setOpenParent] = useState<string | null>(null);
  const [openChild, setOpenChild] = useState<string | null>(null);

  const handleToggleParent = (item: string | null) => {
    setOpenParent(prev => (prev === item ? null : item));
  };

  const handleToggleChild = (item: string | null) => {
    setOpenChild(prev => (prev === item ? null : item));
  };

  const { data: balances, isLoading } = useSWR(
    defaultWallet && currentChain
      ? `/api/balances/overview?walletAddress=${defaultWallet}&chains=${chains
          .filter(n => n.id !== -1)
          .map(n => n.id)
          .join('&chains=')}`
      : null,
    () =>
      userService.getWalletOverview(
        defaultWallet?.address as Address,
        chains.filter(n => n.id !== -1).map(n => n.id)
      ),
    { dedupingInterval: SECOND * 20 }
  );

  const tokenSymbols = ['ETH', 'WETH', 'USDC'];

  const tokenBalances = tokenSymbols.map(symbol => {
    const filteredTokens =
      balances?.assets?.filter(token => token.symbol === symbol) || [];

    const totalAmount = filteredTokens.reduce(
      (sum, token) => sum + Number(token.amount),
      0
    );
    const totalUSD = filteredTokens.reduce(
      (sum, token) => sum + Number(token.amountUSD),
      0
    );
    const currentToken = filteredTokens.find(token => token.symbol === symbol);

    return {
      symbol,
      totalAmount,
      totalUSD,
      token_logo: currentToken?.tokenLogo,
      chains: filteredTokens.map(token => ({
        chainId: token.chainId,
        amount: +token.amount,
        usdValue: +token.amountUSD,
      })),
    };
  });

  const totalUSDForAllChains = tokenBalances.reduce(
    (acc, token) => acc + token.totalUSD,
    0
  );

  if (!wallets) return null;

  const handleReceiveFunds = async () => {
    if (defaultWallet) {
      fundWallet(defaultWallet.address, { chain: base });
    }
  };

  const handleExport = () => {
    exportWallet();
  };

  if (!defaultWallet || !ready || isLoading || !balances || !user) {
    return (
      <div className="min-w-[268px] hidden min-992px:flex text-white items-center h-[200px] justify-center">
        <CgSpinnerAlt className="animate-spin flex items-center h-[200px] justify-center" />
      </div>
    );
  }

  return (
    <div className="absolute top-[23px] hidden min-992px:flex flex-col gap-2 min-w-[268px] w-[268px] h-max border border-solid z-[1000] border-white/10 backdrop-blur-[40px] rounded-2xl">
      <Accordion.Root
        type="single"
        value={openParent ?? undefined}
        onValueChange={handleToggleParent}
        collapsible
        className="w-full"
      >
        <Accordion.Item value="wallet">
          <div className="w-full text-left border-b-[.5px] border-b-white/10">
            <div className="px-5 pt-5 font-radio text-base font-normal text-[#C9C9E280]">
              My balance
            </div>
            <div className="flex items-center py-4 px-5">
              <div className="text-[1.625rem] leading-none font-normal font-radio text-[#C9C9E2]">
                $
                {formatNumber(totalUSDForAllChains, 'en-US', {
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="flex items-center gap-2.5 ml-auto text-xs text-white leading-none font-radio">
                {defaultWallet?.address &&
                  formatAddress(defaultWallet?.address, 5, 3)}
                {defaultWallet?.address && (
                  <CopyButton value={defaultWallet?.address} />
                )}
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {openParent === 'wallet' && (
              <Accordion.Content className="px-[6px]">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-[0.3125rem] pt-2"
                  style={{ willChange }}
                >
                  {tokenBalances.map(token => (
                    <TokenItem
                      key={token.symbol}
                      token={token}
                      openItem={openChild}
                      onToggle={handleToggleChild}
                    />
                  ))}
                  {isEmbeddedWallet && (
                    <div className="flex gap-[0.3125rem] p-[6px]">
                      <SendTransactionModal>
                        <button className="flex justify-between items-center grow w-full px-5 py-4 rounded-[0.625rem] bg-white bg-opacity-[0.06] backdrop-blur-[75px] text-sm font-normal leading-none text-[#C9C9E2] cursor-pointer">
                          Send
                          <ArrowUpRight />
                        </button>
                      </SendTransactionModal>
                      <button
                        className="flex justify-between items-center grow w-full px-5 py-4 rounded-[0.625rem] bg-white bg-opacity-[0.06] backdrop-blur-[75px] text-sm font-normal leading-none text-[#C9C9E2] cursor-pointer"
                        onClick={handleReceiveFunds}
                      >
                        Receive
                        <ArrowUpRight className="rotate-180" />
                      </button>
                      <button
                        className="flex justify-between items-center px-4 py-4 rounded-[0.625rem] bg-white bg-opacity-[0.06] backdrop-blur-[75px] text-sm font-normal leading-none text-[#C9C9E2] cursor-pointer"
                        onClick={handleExport}
                      >
                        <IoKeyOutline className="size-3.5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              </Accordion.Content>
            )}
          </AnimatePresence>
        </Accordion.Item>

        <div
          onClick={() => handleToggleParent('wallet')}
          className="flex justify-center p-[6px] py-2 cursor-pointer"
        >
          {openParent === 'wallet' ? (
            <div className=" hover:opacity-80 duration-300 w-[106px] h-[2px] bg-white/10 rounded-full" />
          ) : (
            <button className="hover:opacity-80 duration-300 w-full text-center text-white text-[10px] bg-[#FFFFFF08] rounded-full">
              ⋯
            </button>
          )}
        </div>
      </Accordion.Root>
    </div>
  );
};
