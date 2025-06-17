import TableComponent from '@/components/DashboardTable';
import { chains } from '@/constants/chains';
import { aerodromeService } from '@/services/aerodromeService';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import * as Tabs from '@radix-ui/react-tabs';
import dayjs from 'dayjs';
import intersectionWith from 'lodash/intersectionWith';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Address } from 'viem';
import { useShallow } from 'zustand/shallow';
import './index.css';
import { LockItem } from './LockItem';
import { PoolItem } from './PoolItem';
import {
  TCombinedVotingReward,
  TUniquePoolAndLock,
  VotingItem,
} from './VotingItem';
import { base, optimism } from 'viem/chains';

export const Pools = () => {
  const [value, setValue] = useState('0');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const defaultWallet = useUserStore(
    useShallow(s => s.userData?.wallets.find(w => w.isDefault))
  );
  const currentChain = useAppStore(useShallow(s => s.currentChain));

  const { data: tokens, isLoading: isTokensLoading } = useSWR(
    `/api/dex/tokens`,
    () =>
      aerodromeService.getAllTokens(
        chains.filter(n => n.id !== -1).map(n => n.id)
      )
  );

  const { data: positions, isLoading: isPositionsLoading } = useSWR(
    [currentChain],
    () =>
      aerodromeService.getPositionsForChains(
        defaultWallet?.address,
        currentChain.id !== -1 ? [currentChain.id] : undefined
      ),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const { data: locks, isLoading: isLocksLoading } = useSWR(
    [currentChain.id],
    () =>
      aerodromeService.getLocksForChains(
        defaultWallet?.address,
        currentChain.id === base.id
          ? [base.id]
          : currentChain.id !== -1
            ? [optimism.id]
            : undefined
      ),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const { data: votingRewards, isLoading: isVotingRewardsLoading } = useSWR(
    [defaultWallet?.address, currentChain.id, !!locks],
    () =>
      aerodromeService.getVotingRewardsForChains(
        defaultWallet?.address as Address | undefined,
        locks,
        currentChain.id !== -1 ? [currentChain.id] : undefined
      ),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const poolsAddressesFromPositions =
    positions?.map(position => ({
      address: position.lp,
      chainId: position.chainId,
    })) ?? [];
  const poolsAddressesFromVotingRewards =
    votingRewards?.map(reward => ({
      address: reward.lp,
      chainId: reward.chainId,
    })) ?? [];

  const lpAddresses = Array.from(
    new Set([
      ...poolsAddressesFromPositions,
      ...poolsAddressesFromVotingRewards,
    ])
  );

  const combinedVotingRewards: Record<string, TUniquePoolAndLock> = {};

  votingRewards?.forEach(el => {
    const pooLAndLockNames = el.lp + el.venft_id;
    if (combinedVotingRewards[pooLAndLockNames]) {
      combinedVotingRewards[pooLAndLockNames].vote.push(el);
    } else {
      combinedVotingRewards[pooLAndLockNames] = {
        lp: el.lp,
        venft_id: el.venft_id,
        vote: [el],
      };
    }
  });

  const { data: allPools, isLoading: isPoolsLoading } = useSWR(
    lpAddresses.length ? ['/api/dex/pools', lpAddresses, currentChain] : null,
    () => aerodromeService.getPoolsByAddresses(lpAddresses),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const { data: rebaseAprs, isLoading: isRebaseAprLoading } = useSWR(
    '/api/dex/rebase-aprs',
    () => aerodromeService.getRebaseApr(),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const liquidityRewardsPools = useMemo(
    () =>
      intersectionWith(
        allPools ?? [],
        positions ?? [],
        (pool, position) => pool.lp === position?.lp
      ).filter(pool => +pool.tvl >= 0.01),
    [allPools, positions]
  );

  const preparedLocks = locks
    ?.map(lock => {
      const expiresAtUnix = Number(lock.expires_at);
      const now = dayjs();
      const expiresAt = dayjs.unix(expiresAtUnix);

      const daysLeft = expiresAt.diff(now, 'days');
      const hoursLeft = expiresAt.diff(now, 'hours');

      const tokenData = tokens?.find(
        t => t.token_address.toLowerCase() === lock.token.toLowerCase()
      );
      const tokenSymbol = tokenData?.symbol || 'Unknown';
      const tokenPrice = tokenData?.price?.toString() || '0';

      return {
        lock,
        expiresAt: daysLeft >= 0 ? daysLeft : -daysLeft,
        isUnlocked: daysLeft < 0,
        hoursLeft: daysLeft < 1 ? Math.max(hoursLeft, 0) : undefined,
        tokenSymbol,
        tokenPrice,
      };
    })
    .filter(lock => lock?.lock?.expires_at !== 0n);

  return (
    <div className="bg-[#171717] bg-opacity-[46%] mb-[30px] max-992px:pb-4 py-6 rounded-[23px] border-[0.5px] border-white/10 min-1400px:h-full">
      <p className="px-8 mb-6 text-[#fff] text-[24px] leading-[26.4px]">
        Active pools
      </p>
      <Tabs.Root value={value} onValueChange={setValue}>
        <div className="border-b-[0.5px] max-992px:px-[22px] px-8 border-white/10">
          <Tabs.List className="flex max-992px:gap-4 gap-9">
            <Tabs.Trigger
              value="0"
              className="pools-tab max-992px:text-[11px] cursor-pointer hover:opacity-70 duration-300 transition-opacity pb-3 ml-0 text-white"
            >
              Liquidity rewards
            </Tabs.Trigger>
            <Tabs.Trigger
              value="1"
              className="pools-tab max-992px:text-[11px] cursor-pointer hover:opacity-70 duration-300 transition-opacity pb-3 ml-0 text-white"
            >
              Locks
            </Tabs.Trigger>
            <Tabs.Trigger
              value="2"
              className="pools-tab max-992px:text-[11px] cursor-pointer hover:opacity-70 duration-300 transition-opacity pb-3 ml-0 text-white"
            >
              Voting rewards
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content className="max-992px:px-[6px] px-[26px]" value="0">
          <div className="mt-4 poolsTable overflow-y-scroll scrollbar-hidden">
            <TableComponent
              columns={['Pool', 'APR', 'TVL', 'Volume', 'Fee', 'Deposited']}
              data={liquidityRewardsPools}
              isLoading={
                isPositionsLoading ||
                isPoolsLoading ||
                isTokensLoading ||
                isPositionsLoading
              }
              renderRow={(pool, index) => (
                <PoolItem
                  key={index}
                  pool={pool}
                  isOpen={activeIndex === index}
                  index={index}
                  setActiveIndex={setActiveIndex}
                  positions={positions}
                  poolsData={liquidityRewardsPools || []}
                />
              )}
              emptyMessage="You haven't provided Liquidity yet."
            />
          </div>
        </Tabs.Content>

        <Tabs.Content className="max-992px:px-[6px] px-[26px]" value="1">
          <div className="flex flex-col gap-3 mt-4 poolsTable">
            <TableComponent
              columns={['Lock', 'Locked', 'Status', 'Rebase APR', 'Rebases']}
              data={
                currentChain.id === base.id ||
                currentChain.id === optimism.id ||
                currentChain.id === -1
                  ? preparedLocks
                  : []
              }
              isLoading={
                isTokensLoading || isRebaseAprLoading || isLocksLoading
              }
              renderRow={({
                lock,
                expiresAt,
                isUnlocked,
                hoursLeft,
                tokenSymbol,
                tokenPrice,
              }) => (
                <LockItem
                  key={lock.id}
                  token={tokenSymbol}
                  lock={lock}
                  expiresAt={expiresAt}
                  hoursLeft={hoursLeft}
                  isUnlocked={isUnlocked}
                  tokenPrice={tokenPrice.toString()}
                  rebaseAprs={rebaseAprs}
                />
              )}
              emptyMessage="To receive incentives and fees create a lock and vote with it."
            />
          </div>
        </Tabs.Content>

        <Tabs.Content className="max-992px:px-[6px] px-[26px]" value="2">
          <div className="mt-4 poolsTable">
            <TableComponent
              columns={['Pool', 'Type', 'Fee', 'Lock', 'Reward']}
              data={
                Object.entries(combinedVotingRewards) as TCombinedVotingReward[]
              }
              isLoading={isPoolsLoading || isVotingRewardsLoading}
              renderRow={(vote: TCombinedVotingReward, i: number) => (
                <VotingItem key={i} vote={vote} pools={allPools} />
              )}
              emptyMessage="No rewards found."
            />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
