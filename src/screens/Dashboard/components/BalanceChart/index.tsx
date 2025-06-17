import { useMemo } from 'react';
import clsx from 'clsx';
import { IoKeyOutline } from 'react-icons/io5';
import { CopyButton } from '@/components/CopyButton';
import { SendTransactionModal } from '@/components/SendTransactionModal';
import { formatNumber } from '@/utilities/number';
import { formatAddress } from '@/utilities/formatAddress';
import { useUserStore } from '@/stores/user';
import { useShallow } from 'zustand/shallow';
import { useFundWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import { ArrowUpRight } from '@/assets/icons/Arrow';
import { base } from 'viem/chains';
import { CgSpinnerAlt } from 'react-icons/cg';
import useSWR from 'swr';
import { userService } from '@/services/userService';
import { Address } from 'viem';
import getColorFromString from 'string-to-color';
import { Chart } from './components/Chart';
import { AssetsList } from './components/AssetsList';
import { ScrollArea } from '@/components/ScrollArea';
import { IoMdArrowUp } from 'react-icons/io';
import { useAppStore } from '@/stores/app';
import { chains } from '@/constants/chains';
import { BASE_ID } from '@/constants/chains/base';
import { OPTIMISM_ID } from '@/constants/chains/optimism';
import { SECOND } from '@/constants/time';

export const BalanceChart = () => {
  const { wallets } = useWallets();
  const { fundWallet } = useFundWallet();
  const { exportWallet } = usePrivy();
  const currentChain = useAppStore(useShallow(s => s.currentChain));
  const defaultWallet = useUserStore(
    useShallow(s => s.userData?.wallets.find(w => w.isDefault))
  );

  const getNeededSymbols = (chainId: number) => {
    if (chainId === BASE_ID) return ['ETH', 'USDC', 'AERO'];
    if (chainId === OPTIMISM_ID) return ['ETH', 'USDC', 'VELO'];
    return null;
  };

  const neededSymbols = getNeededSymbols(currentChain.id);

  const { data: balances } = useSWR(
    defaultWallet && currentChain
      ? `/api/balances/overview?walletAddress=${defaultWallet}&chains=${
          currentChain.id === -1
            ? chains
                .filter(n => n.id !== -1)
                .map(n => n.id)
                .join('&chains=')
            : currentChain.id
        }`
      : null,
    () =>
      userService.getWalletOverview(
        defaultWallet?.address as Address,
        currentChain.id === -1
          ? chains.filter(n => n.id !== -1).map(n => n.id)
          : [currentChain.id]
      ),
    { dedupingInterval: SECOND * 20 }
  );

  const sortedAssets =
    balances?.assets
      .sort((a, b) => b.allocationPercent - a.allocationPercent)
      .map(asset => ({
        name: asset.symbol,
        value: asset.allocationPercent,
        color: getColorFromString(asset.token_address),
        amountUsd: asset.amountUSD,
        chainId: asset.chainId,
        token_address: asset.token_address,
      })) || [];

  const mainTokens = neededSymbols
    ? sortedAssets.filter(asset => neededSymbols.includes(asset.name))
    : sortedAssets.slice(0, 4);

  const otherTokens = sortedAssets
    .filter(
      asset =>
        !mainTokens.some(main => main.token_address === asset.token_address)
    )
    .sort((a, b) => b.amountUsd - a.amountUsd);

  const isEmbeddedWallet = useMemo(() => {
    const wallet = wallets.find(w => w.address === defaultWallet?.address);

    return wallet?.walletClientType === 'privy';
  }, [wallets, defaultWallet]);

  const handleReceiveFunds = async () => {
    if (!defaultWallet) return;

    fundWallet(defaultWallet.address, {
      chain: base,
    });
  };

  const handleExport = async () => {
    exportWallet();
  };

  return (
    <div className="pb-4 w-full max-992px:auto h-full min-1400px:auto">
      <div className="px-8 text-[24px] text-[#E0E0F5] leading-[26.4px]">
        Balance overview
      </div>
      {balances ? (
        <div>
          <div
            className={clsx(
              'mb-4 border-b-[0.5px] border-white/10 flex items-center pl-3 pr-8',
              balances.assets.length === 0
                ? 'justify-center'
                : 'justify-between'
            )}
          >
            <Chart
              data={[...mainTokens, ...otherTokens]}
              totalTokensAmount={balances.tokenQty}
            />
            {balances.assets.length === 0 && (
              <span className="text-[15px] text-white/30">
                You don't have any tokens
              </span>
            )}
            <AssetsList mainTokens={mainTokens} otherTokens={otherTokens} />
          </div>
          <div className="flex flex-col justify-between">
            <div className="px-8 flex justify-between items-end w-full">
              <div className="flex flex-col gap-3">
                <span className="leading-[14.4px] font-radio text-[#C9C9E2]/50">
                  My balance
                </span>
                <span className="text-[32px] leading-[23.4px] font-radio text-[#C9C9E2]">
                  $ {balances && +(balances?.currentBalance).toFixed(2)}
                </span>
              </div>
              <div className="flex text-bottom items-center gap-[10px] leading-[10px]">
                {defaultWallet?.address && (
                  <span className="text-[10px] text-white">
                    {formatAddress(defaultWallet?.address, 5, 3)}
                  </span>
                )}
                {defaultWallet?.address && (
                  <CopyButton value={defaultWallet?.address} />
                )}
              </div>
            </div>
            {isEmbeddedWallet && (
              <div className="flex gap-[0.3125rem] mt-4 px-4 pb-[8px]">
                <SendTransactionModal>
                  <button
                    disabled={balances.assets.length === 0}
                    className="cursor-pointer flex justify-center disabled:opacity-40 disabled:cursor-not-allowed gap-[9px] items-center grow w-full px-5 py-4 rounded-[10px] bg-[#FFFFFF0F] text-sm text-[#C9C9E2]"
                  >
                    Send <ArrowUpRight />
                  </button>
                </SendTransactionModal>
                <button
                  className="cursor-pointer flex justify-center gap-[9px] items-center grow w-full px-5 py-4 rounded-[10px] bg-[#FFFFFF0F] text-sm text-[#C9C9E2]"
                  onClick={handleReceiveFunds}
                >
                  Receive <ArrowUpRight className="rotate-180" />
                </button>
                <button
                  className="cursor-pointer flex justify-center gap-[9px] items-center px-4 py-4 rounded-[10px] bg-[#FFFFFF0F] text-sm text-[#C9C9E2]"
                  onClick={handleExport}
                >
                  <IoKeyOutline className="size-3.5" />
                </button>
              </div>
            )}
            <div className="pr-4">
              {balances.assets.length !== 0 && (
                <div className="pr-4">
                  <ScrollArea
                    className={clsx(
                      'mt-4 pl-8 pr-2 max-h-[200px] overflow-y-auto flex flex-col gap-4',
                      !isEmbeddedWallet && 'max-h-[240px]'
                    )}
                  >
                    {balances.assets
                      ?.sort((a, b) => b.amountUSD - a.amountUSD)
                      .map((token, i) => (
                        <div
                          className="flex justify-between gap-4 items-center pb-2 pt-2 border-b-[0.5px] border-white/10 last:border-0"
                          key={i}
                        >
                          <div className="flex items-center gap-[6px]">
                            <div className="flex flex-col gap-[6px]">
                              <span className="text-[14px] leading-[12.6px] text-white ">
                                {token.tokenName}
                              </span>
                              <div
                                className={clsx(
                                  'flex items-center gap-[2px] text-[10px]',
                                  token.pnl > 0
                                    ? 'text-[#64CE88]'
                                    : 'text-[#E64054]'
                                )}
                              >
                                <IoMdArrowUp
                                  className={clsx(
                                    'text-[11px]',
                                    token.pnl > 0
                                      ? 'rotate-[45deg]'
                                      : 'rotate-[-135deg]'
                                  )}
                                />
                                {token.pnl > 0 ? '+' : ''}
                                {token.pnl.toFixed(2)}%
                              </div>
                            </div>
                          </div>

                          <div className="flex items-end justify-end gap-[3px] w-fit flex-col">
                            <span className="text-[10px] leading-[10px] text-[#FFFFFF99]">
                              ${Math.floor(token.amountUSD * 100) / 100}
                            </span>
                            <div className="text-[14px] leading-[12.6px] text-white w-fit block text-right">
                              <span className="w-fit">
                                {formatNumber(token.amount)} {token.symbol}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center pt-6">
          <CgSpinnerAlt className="animate-spin text-[35px] text-white" />
        </div>
      )}
    </div>
  );
};
