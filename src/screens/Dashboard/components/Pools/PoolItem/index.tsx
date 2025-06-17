import { ExpandIcon } from '@/assets/icons/ExpandIcon';
import { userService } from '@/services/userService';
import { useUserStore } from '@/stores/user';
import { ILendingPool, TPosition } from '@/types/aerodrome';
import { formatNumber } from '@/utilities/number';
import { TableCell, TableRow } from '@mui/material';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import useSWR from 'swr';
import { Address, formatUnits } from 'viem';
import { TokenIcons } from '../../TokenIcons';
import { useShallow } from 'zustand/shallow';
import { appStore, useAppStore } from '@/stores/app';
import { TooltipWrapper } from '../../TokenUsdBalance';
import { chains } from '@/constants/chains';
import { SECOND } from '@/constants/time';

interface IPoolItemProps {
  pool: ILendingPool;
  positions: TPosition[] | undefined;
  isOpen: boolean;
  index: number;
  setActiveIndex: (arg: number | null) => void;
  poolsData: ILendingPool[];
}

export const PoolItem = ({
  pool,
  isOpen,
  index,
  setActiveIndex,
  positions,
  poolsData,
}: IPoolItemProps) => {
  const poolsPositions = positions?.filter(position => position.lp === pool.lp);
  const defaultWallet = useUserStore(
    useShallow(s => s.userData?.wallets.find(w => w.isDefault))
  );
  const tokens = appStore(useShallow(({ tokens }) => tokens));
  const { tokenPrice0, tokenPrice1 } = pool;
  const currentChain = useAppStore(useShallow(s => s.currentChain));
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

  const token0 = tokens?.[pool.token0 as Address];
  const token1 = tokens?.[pool.token1 as Address];
  const emissionsToken = tokens?.[pool.emissions_token as Address];

  const token0InWallet =
    balances?.assets?.find(
      asset => asset.token_address === token0?.token_address
    ) || null;
  const token1InWallet =
    balances?.assets?.find(
      asset => asset.token_address === token1?.token_address
    ) || null;

  const getTotalValue = (poolsData: ILendingPool[]) => {
    return poolsPositions?.reduce((sum, position) => {
      const pool = poolsData.find(pool => pool.lp === position.lp);
      if (!pool || !tokens) return sum;

      const { amount0, amount1, staked0, staked1 } = position;

      const positionValue =
        Number(formatUnits(amount0, token0?.decimals || 18)) *
          Number(tokenPrice0) +
        Number(formatUnits(amount1, token1?.decimals || 18)) *
          Number(tokenPrice1) +
        Number(formatUnits(staked0, token0?.decimals || 18)) *
          Number(tokenPrice0) +
        Number(formatUnits(staked1, token1?.decimals || 18)) *
          Number(tokenPrice1);

      return sum + positionValue;
    }, 0);
  };

  const totalDeposited = getTotalValue(poolsData);
  const expandingDisabled = !poolsPositions?.length;

  return (
    <>
      <>
        <TableRow
          className={clsx(
            `poolItem cursor-pointer border-none`,
            isOpen && 'active'
          )}
        >
          <TableCell className="text-white">
            <div className="flex items-center gap-4">
              <TokenIcons
                token0={pool?.token0}
                token1={pool?.token1}
                token0Symbol={pool?.token0Symbol}
                token1Symbol={pool?.token1Symbol}
                chainId={pool?.chainId}
              />
              <div className="text-[14px] leading-[11.2px] text-[#fff]">
                {pool.symbol}
              </div>
            </div>
          </TableCell>
          <TableCell className="text-white">
            {Number(pool.apr).toFixed(2)}%
          </TableCell>
          <TableCell>${formatNumber(pool.tvl)}</TableCell>
          <TableCell>${formatNumber(pool.volume)}</TableCell>
          <TableCell>
            {formatUnits(BigInt(pool.pool_fee), pool.type > 0 ? 4 : 2)}%
          </TableCell>
          <TableCell>${formatNumber(totalDeposited || 0)}</TableCell>
          <TableCell className="text-right w-[60px] !pr-1" align="right">
            <button
              disabled={expandingDisabled}
              onClick={() => setActiveIndex(isOpen ? null : index)}
              className={clsx(
                'p-2',
                expandingDisabled && 'pointer-events-none opacity-50'
              )}
            >
              {isOpen ? (
                <div className="hover:opacity-70 duration-300 flex items-center justify-between gap-[6px] p-[6px] pr-3 bg-[#FFFFFF0F] rounded-[8px] text-[#FFFFFF99] text-[10px] min-w-[67px]">
                  <div>
                    <IoMdClose />
                  </div>
                  Close
                </div>
              ) : (
                <div className="hover:opacity-70 duration-300 flex items-center justify-between gap-[6px] p-[6px] pr-3 bg-[#FFFFFF0F] rounded-[8px] text-[#FFFFFF99] text-[10px] min-w-[67px]">
                  <div>
                    <ExpandIcon width={13} height={13} />
                  </div>
                  Details
                </div>
              )}
            </button>
          </TableCell>
        </TableRow>
        <AnimatePresence>
          {isOpen &&
            poolsPositions?.map((position, idx) => {
              return (
                <tr key={idx} className="details max-992px:hidden">
                  <td colSpan={7} className={clsx('border-[#ffffff12] p-0 ')}>
                    <div className="pb-4 px-4 pt-4 text-[10px] leading-[11px] text-[#C9C9E299] bg-[#FFFFFF08] border-white/10 border-t-[0.5px]">
                      <span className="!underline-none">
                        Deposit #{position.id.toString()}
                      </span>
                    </div>
                    <div
                      className={clsx(
                        'grid grid-cols-5 gap-x-[100px] w-full bg-[#FFFFFF08] px-4 pb-4',
                        idx === poolsPositions.length - 1 &&
                          'rounded-bl-[16px] rounded-br-[16px] mb-[3px] pb-4'
                      )}
                    >
                      <div className="text-left">
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] leading-[11px] text-[#C9C9E299]">
                            In wallet
                          </span>

                          <TooltipWrapper
                            amount={token0InWallet?.amount ?? 0}
                            price={token0?.price}
                          >
                            <div className="text-[12px] leading-[13.2px] text-white flex items-center gap-[3px]">
                              <span>
                                {formatNumber(token0InWallet?.amount ?? 0)}
                              </span>
                              <span className="text-[#C9C9E2]">
                                {token0?.symbol}
                              </span>
                            </div>
                          </TooltipWrapper>

                          <TooltipWrapper
                            amount={token1InWallet?.amount ?? 0}
                            price={token1?.price}
                          >
                            <div className="text-[12px] leading-[13.2px] text-white flex items-center gap-[3px]">
                              <span>
                                {formatNumber(token1InWallet?.amount ?? 0)}
                              </span>
                              <span className="text-[#C9C9E2]">
                                {token1?.symbol}
                              </span>
                            </div>
                          </TooltipWrapper>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className=" flex flex-col gap-2">
                          <span className="text-[10px] leading-[11px] text-[#C9C9E299]">
                            Unstaked
                          </span>
                          <TooltipWrapper
                            amount={position.amount0}
                            price={token0?.price}
                            decimals={token0InWallet?.decimals}
                          >
                            <div className="text-[12px] leading-[13.2px] text-white flex items-center gap-[3px]">
                              <span>
                                {Number(
                                  formatUnits(
                                    position.amount0,
                                    token0InWallet?.decimals || 18
                                  )
                                ).toFixed(5)}
                              </span>
                              <span className="text-[#C9C9E2]">
                                {token0?.symbol}
                              </span>
                            </div>
                          </TooltipWrapper>

                          <TooltipWrapper
                            amount={position.amount1}
                            price={token1?.price}
                            decimals={token1InWallet?.decimals}
                          >
                            <div className="text-[12px] leading-[13.2px] text-white flex items-center gap-[3px]">
                              <span>
                                {Number(
                                  formatUnits(
                                    position.amount1,
                                    token1InWallet?.decimals || 18
                                  )
                                ).toFixed(5)}
                              </span>
                              <span className="text-[#C9C9E2]">
                                {token1?.symbol}
                              </span>
                            </div>
                          </TooltipWrapper>
                        </div>
                      </div>
                      <div className="pl-[0px] text-left">
                        <div className=" flex flex-col gap-2">
                          <span className="text-[10px] leading-[11px] text-[#C9C9E299]">
                            Trading fees
                          </span>
                          <TooltipWrapper
                            amount={position.unstaked_earned0}
                            price={token0?.price}
                            decimals={token0?.decimals}
                          >
                            <div className="text-[12px] leading-[13.2px] text-white flex items-center gap-[3px]">
                              <span>
                                {position.unstaked_earned0
                                  ? formatNumber(
                                      formatUnits(
                                        position.unstaked_earned0,
                                        token0?.decimals || 18
                                      )
                                    )
                                  : '0.0'}
                              </span>
                              <span className="text-[#C9C9E2]">
                                {token0?.symbol}
                              </span>
                            </div>
                          </TooltipWrapper>

                          <TooltipWrapper
                            amount={position.unstaked_earned1}
                            price={token1?.price}
                            decimals={token1?.decimals}
                          >
                            <div className="text-[12px] leading-[13.2px] text-white flex items-center gap-[3px]">
                              <span>
                                {position.unstaked_earned1
                                  ? formatNumber(
                                      formatUnits(
                                        position.unstaked_earned1,
                                        token1?.decimals || 18
                                      )
                                    )
                                  : '0.0'}
                              </span>
                              <span className="text-[#C9C9E2]">
                                {token1?.symbol}
                              </span>
                            </div>
                          </TooltipWrapper>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className=" flex flex-col gap-2">
                          <span className="text-[10px] leading-[11px] text-[#C9C9E299]">
                            Staked
                          </span>
                          <TooltipWrapper
                            amount={position.staked0}
                            price={token0?.price}
                            decimals={token0?.decimals}
                          >
                            <div className="text-[12px] leading-[13.2px] text-white flex items-center gap-[3px]">
                              <span>
                                {position.staked0
                                  ? formatNumber(
                                      formatUnits(
                                        position.staked0,
                                        token0?.decimals || 18
                                      )
                                    )
                                  : '0.0'}
                              </span>
                              <span className="text-[#C9C9E2]">
                                {token0?.symbol}
                              </span>
                            </div>
                          </TooltipWrapper>
                          <TooltipWrapper
                            amount={position.staked1}
                            price={token1?.price}
                            decimals={token1?.decimals}
                          >
                            <div className="text-[12px] leading-[13.2px] text-white flex items-center gap-[3px]">
                              <span>
                                {position.staked1
                                  ? formatNumber(
                                      formatUnits(
                                        position.staked1,
                                        token1?.decimals || 18
                                      )
                                    )
                                  : '0.0'}
                              </span>
                              <span className="text-[#C9C9E2]">
                                {token1?.symbol}
                              </span>
                            </div>
                          </TooltipWrapper>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className=" flex flex-col gap-2">
                          <span className="text-[10px] leading-[11px] text-[#C9C9E299]">
                            Emissions
                          </span>
                          <TooltipWrapper
                            amount={position.emissions_earned}
                            price={emissionsToken?.price}
                            decimals={emissionsToken?.decimals}
                          >
                            <div className="text-[12px] leading-[13.2px] text-white flex items-center gap-[3px]">
                              <span>
                                {formatNumber(
                                  formatUnits(
                                    position.emissions_earned,
                                    emissionsToken?.decimals || 18
                                  )
                                )}
                              </span>
                              <span className="text-[#C9C9E2]">
                                {emissionsToken?.symbol}
                              </span>
                            </div>
                          </TooltipWrapper>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
        </AnimatePresence>

        <div className="min-992px:hidden pt-3 bg-[#FFFFFF08] rounded-[12px] mb-[6px]">
          <div className="flex flex-col gap-[6px] px-4 mb-[10px]">
            <p className="text-[#C9C9E280] text-[8px] leading-[8.8px]">Pool</p>
            <div className="flex items-center gap-4">
              <TokenIcons
                token0={pool?.token0}
                token1={pool?.token1}
                chainId={pool?.chainId}
              />
              <div className="text-[14px] leading-[11.2px] text-[#fff]">
                {pool.symbol}
              </div>
            </div>
          </div>
          <div className="flex px-4 justify-between pb-3">
            <div className="flex flex-col gap-[14px]">
              <div>
                <p className="text-[8px] text-[#C9C9E280] mb-[6px]">TVL</p>
                <p className="text-[10px] text-white">
                  ${formatNumber(pool.tvl)}
                </p>
              </div>
              <div>
                <p className="text-[8px] text-[#C9C9E280] mb-[6px]">
                  Deposited
                </p>
                <p className="text-[10px] text-white">
                  ${formatNumber(totalDeposited || 0)}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-[14px]">
              <div>
                <p className="text-[8px] text-[#C9C9E280] mb-[6px]">Volume</p>
                <p className="text-[10px] text-white">
                  ${formatNumber(pool.volume)}
                </p>
              </div>
              <div>
                <p className="text-[8px] text-[#C9C9E280] mb-[6px]">Fee</p>
                <p className="text-[10px] text-white">
                  {formatUnits(BigInt(pool.pool_fee), pool.type > 0 ? 4 : 2)}%
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[8px] text-[#C9C9E280] mb-[6px]">APR</p>
                <p className="text-[10px] text-white">
                  {Number(pool.apr).toFixed(2)}%
                </p>
              </div>
              <button onClick={() => setActiveIndex(isOpen ? null : index)}>
                {isOpen ? (
                  <div className="hover:opacity-70 duration-300 flex items-center gap-[6px] p-[6px] pr-3 w-[62px] bg-[#FFFFFF0F] rounded-[8px] text-[#FFFFFF99] text-[10px]">
                    <div>
                      <IoMdClose />
                    </div>
                    Close
                  </div>
                ) : (
                  <div className="hover:opacity-70 duration-300 flex items-center gap-[6px] p-[6px] pr-3 w-[62px] bg-[#FFFFFF0F] rounded-[8px] text-[#FFFFFF99] text-[10px]">
                    <div>
                      <ExpandIcon width={13} height={13} />
                    </div>
                    Details
                  </div>
                )}
              </button>
            </div>
          </div>
          {isOpen && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  opacity: { duration: 0.3, ease: 'easeInOut' },
                  height: { duration: 0.3, ease: 'easeInOut' },
                }}
                className="pb-1 border-t-[0.5px] border-white/10 max-h-[200px] overflow-y-auto scrollbar-hidden"
              >
                {poolsPositions?.map(position => (
                  <div className="mobilePosition p-4 border-b-[0.5px] border-white/10">
                    <p className="text-[#C9C9E299] text-[10px] mb-4">
                      Deposit #{position.id.toString()}
                    </p>
                    <div className="flex justify-between">
                      <div className="flex w-[45%] flex-col gap-[35px]">
                        <div className="flex flex-col gap-[6px]">
                          <span className="text-[8px] leading-[8.8px] text-[#C9C9E299]">
                            Emissions
                          </span>
                          <div className="text-[10px] leading-[11px] text-white flex items-center gap-[3px]">
                            <span>
                              {formatNumber(
                                formatUnits(
                                  position.emissions_earned,
                                  emissionsToken?.decimals || 18
                                )
                              )}
                            </span>
                            <span className="text-[#C9C9E2]">
                              {emissionsToken?.symbol}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-[6px] -mb-1">
                          <span className="text-[8px] leading-[8.8px] text-[#C9C9E299]">
                            Staked
                          </span>
                          <div className="text-[10px] leading-[11px] text-white flex items-center gap-[3px]">
                            <span>
                              {position.staked0
                                ? formatNumber(
                                    formatUnits(
                                      position.staked0,
                                      token0?.decimals || 18
                                    )
                                  )
                                : '0.0'}
                            </span>
                            <span className="text-[#C9C9E2]">
                              {token0?.symbol}
                            </span>
                          </div>
                          <div className="text-[10px] leading-[13.2px] text-white flex items-center gap-[3px]">
                            <span>
                              {position.staked1
                                ? formatNumber(
                                    formatUnits(
                                      position.staked1,
                                      token1?.decimals || 18
                                    )
                                  )
                                : '0.0'}
                            </span>
                            <span className="text-[#C9C9E2]">
                              {token1?.symbol}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-[55%] flex-col gap-4">
                        <div className=" flex flex-col gap-[6px]">
                          <span className="text-[8px] leading-[8.8px] text-[#C9C9E299]">
                            In wallet
                          </span>
                          <div className="text-[10px] leading-[11px] text-white flex items-center gap-[3px]">
                            <span>
                              {formatNumber(token0InWallet?.amount || 0)}
                            </span>
                            <span className="text-[#C9C9E2]">
                              {token0InWallet?.symbol}
                            </span>
                          </div>
                          <div className="text-[10px] leading-[13.2px] text-white flex items-center gap-[3px]">
                            <span>
                              {formatNumber(token1InWallet?.amount || 0)}
                            </span>
                            <span className="text-[#C9C9E2]">
                              {token1InWallet?.symbol}
                            </span>
                          </div>
                        </div>
                        <div className=" flex flex-col gap-[6px]">
                          <span className="text-[8px] leading-[8.8px] text-[#C9C9E299]">
                            Trading fees
                          </span>
                          <div className="text-[10px] leading-[11px] text-white flex items-center gap-[3px]">
                            <span>
                              {position.unstaked_earned0
                                ? formatNumber(
                                    formatUnits(
                                      position.unstaked_earned0,
                                      token0?.decimals || 18
                                    )
                                  )
                                : '0.0'}
                            </span>
                            <span className="text-[#C9C9E2]">
                              {token0?.symbol}
                            </span>
                          </div>
                          <div className="text-[10px] leading-[11px] text-white flex items-center gap-[3px]">
                            <span>
                              {position.unstaked_earned1
                                ? formatNumber(
                                    formatUnits(
                                      position.unstaked_earned1,
                                      token1?.decimals || 18
                                    )
                                  )
                                : '0.0'}
                            </span>
                            <span className="text-[#C9C9E2]">
                              {token1?.symbol}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </>
    </>
  );
};
