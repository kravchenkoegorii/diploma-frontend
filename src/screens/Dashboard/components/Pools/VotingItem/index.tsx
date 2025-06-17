import { ILendingPool, TVotingReward } from '@/types/aerodrome';
import { TableCell, TableRow } from '@mui/material';
import { Address, formatUnits } from 'viem';
import { TokenIcons } from '../../TokenIcons';
import { appStore } from '@/stores/app';
import { TokenImage } from '@/components/TokenImage';
import { useShallow } from 'zustand/shallow';

export type TUniquePoolAndLock = {
  lp: Address;
  venft_id: bigint;
  vote: TVotingReward[];
};

export type TCombinedVotingReward = [string, TUniquePoolAndLock];

interface IVotingItemProps {
  vote: TCombinedVotingReward;
  pools: ILendingPool[] | undefined;
}

export const VotingItem = ({ vote, pools }: IVotingItemProps) => {
  const tokens = appStore(useShallow(({ tokens }) => tokens));
  const pool = pools?.find(pool => pool.lp === vote[1].lp);

  return (
    <>
      <TableRow className="votingItem max-992px:!hidden min-h-[50px]">
        <TableCell>
          <div className="flex items-center gap-4 py-[6px]">
            <TokenIcons
              token0={pool?.token0 as string}
              token1={pool?.token1 as string}
              token0Symbol={pool?.token0Symbol}
              token1Symbol={pool?.token1Symbol}
              chainId={pool?.chainId}
            />
            <span className="text-[12px] leading-[9.6px]">{pool?.symbol}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-[12px] text-[#C9C9E2] leading-[9.6px]">
            {pool &&
              (pool?.type === 0 ? (
                <div>(x) Basic Stable</div>
              ) : pool?.type === -1 ? (
                <div>(x) Basic Volatile</div>
              ) : pool?.type > 0 && pool?.type <= 50 ? (
                <div className="flex items-center gap-[3px]">
                  <p className="text-[8px] leading-[5.5px] italic py-[2px] px-[3px] border ">
                    f
                  </p>{' '}
                  Concentrated Stable
                </div>
              ) : pool?.type > 50 ? (
                <div className="flex items-center gap-[3px]">
                  <p className="text-[8px] leading-[5.5px] italic py-[2px] px-[3px] border ">
                    f
                  </p>{' '}
                  Concentrated Volatile
                </div>
              ) : (
                ''
              ))}
          </div>
        </TableCell>
        <TableCell>
          <span className="text-[12px] leading-[9.6px]">
            {pool
              ? formatUnits(BigInt(pool?.pool_fee), pool.type > 0 ? 4 : 2)
              : 0.0}
            %
          </span>
        </TableCell>

        <TableCell>
          <span className="text-[12px] leading-[9.6px]">
            #{vote[1].venft_id.toString()}
          </span>
        </TableCell>
        <TableCell>
          <div className=" text-[12px] flex flex-col gap-1 ">
            {vote[1].vote.map(vote => (
              <div className="text-white text-[10px] leading-[11px] flex items-center gap-1">
                <TokenImage
                  size={12}
                  src={`https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/8453/${vote.token.toLowerCase()}/logo.svg`}
                />
                {(
                  Math.floor(
                    Number(
                      formatUnits(
                        vote.amount,
                        tokens?.[vote.token]?.decimals || 18
                      )
                    ) * 100_000
                  ) / 100_000
                )?.toFixed(5)}
                <span className="text-[#C9C9E2]">
                  {tokens?.[vote.token]?.symbol}
                </span>
              </div>
            ))}
          </div>
        </TableCell>
      </TableRow>

      <div className="min-992px:hidden pt-3 bg-[#FFFFFF08] rounded-[12px] mb-[6px]">
        <div className="flex flex-col gap-[6px] px-4 mb-4">
          <p className="text-[#C9C9E280] text-[8px] leading-[8.8px]">Pool</p>
          <div className="flex gap-3 items-center">
            <TokenIcons
              token0={pool?.token0 as string}
              token1={pool?.token1 as string}
              token0Symbol={pool?.token0Symbol}
              token1Symbol={pool?.token1Symbol}
              chainId={pool?.chainId}
            />
            <div className="text-[10px] text-[#C9C9E2] leading-[9.6px]">
              {pool &&
                (pool?.type === 0 ? (
                  <div>(x) Basic Stable</div>
                ) : pool?.type === -1 ? (
                  <div>(x) Basic Volatile</div>
                ) : pool?.type > 0 && pool?.type <= 50 ? (
                  <div className="flex items-center gap-[3px]">
                    <p className="text-[8px] leading-[5.5px] italic py-[2px] px-[3px] border ">
                      f
                    </p>{' '}
                    Concentrated Stable
                  </div>
                ) : pool?.type > 50 ? (
                  <div className="flex items-center gap-[3px]">
                    <p className="text-[8px] leading-[5.5px] italic py-[2px] px-[3px] border ">
                      f
                    </p>{' '}
                    Concentrated Volatile
                  </div>
                ) : (
                  ''
                ))}
            </div>
          </div>
        </div>
        <div className="flex px-4 justify-between pb-3">
          <div className="flex flex-col gap-[6px]">
            <span className="text-[8px] leading-[8.8px] text-[#C9C9E299] ">
              Fee
            </span>
            <div className="text-white text-[10px] leading-[11px] flex gap-[3px]">
              {pool
                ? formatUnits(BigInt(pool?.pool_fee), pool.type > 0 ? 4 : 2)
                : 0.0}
              %
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[8px] leading-[8.8px] text-[#C9C9E299] ">
              Lock
            </span>
            <div className="text-white text-[10px] leading-[11px] flex gap-[3px]">
              #{vote[1].venft_id.toString()}
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[8px] leading-[8.8px] text-[#C9C9E299] ">
              Reward
            </span>
            {vote[1].vote.map(vote => (
              <div className="text-white text-[10px] leading-[11px] flex gap-[3px]">
                {(
                  Math.floor(
                    Number(
                      formatUnits(
                        vote.amount,
                        tokens?.[vote.token]?.decimals || 18
                      )
                    ) * 100_000
                  ) / 100_000
                )?.toFixed(5)}
                <span className="text-[#C9C9E2]">
                  {tokens?.[vote.token]?.symbol}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
