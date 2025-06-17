import { TLock } from '@/types/aerodrome';
import { formatNumber } from '@/utilities/number';
import { TableCell, TableRow } from '@mui/material';
import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { base } from 'viem/chains';

interface ILockItemProps {
  lock: TLock;
  expiresAt: number | undefined;
  token: string;
  isUnlocked: boolean;
  hoursLeft: number | undefined;
  tokenPrice: string;
  rebaseAprs?: { chainId: number; rebaseApr: number }[];
}

export const LockItem = ({
  lock,
  expiresAt,
  isUnlocked,
  hoursLeft,
  token,
  tokenPrice,
  rebaseAprs,
}: ILockItemProps) => {
  const lockImage = useMemo(() => {
    if (lock.chainId === base.id) {
      return 'https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/8453/0x940181a94a35a4569e4529a3cdfb74e38fd98631/logo.svg';
    }
    console.log(lock);

    return 'https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens//10/0x9560e827af36c94d2ac33a39bce1fe78631088db/logo.svg';
  }, [lock.chainId]);

  const rebaseApr = useMemo(() => {
    return rebaseAprs?.find(apr => apr.chainId === lock.chainId);
  }, [rebaseAprs, lock.chainId]);

  return (
    <>
      <TableRow className="lockItem max-992px:!hidden relative">
        <TableCell>
          <div className="flex gap-4 my-[6px] items-center">
            <img width={26} height={26} src={lockImage} alt="" />
            <span className="text-[12px] leading-[9.6px]">
              #{lock.id.toString()}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <span className="text-[12px]">
            $
            {(
              Number(formatUnits(lock.amount, lock.decimals)) * +tokenPrice
            ).toFixed(2)}
          </span>
        </TableCell>
        <TableCell>
          <span className="text-[12px]">
            {expiresAt !== undefined
              ? isUnlocked
                ? expiresAt < 1 && hoursLeft !== undefined
                  ? `Unlocked ${hoursLeft} hour${hoursLeft === 1 ? '' : 's'} ago`
                  : `Unlocked ${expiresAt} day${expiresAt === 1 ? '' : 's'} ago`
                : expiresAt < 1 && hoursLeft !== undefined
                  ? `Locked for ${hoursLeft} hour${hoursLeft === 1 ? '' : 's'}`
                  : `Locked for ${expiresAt} day${expiresAt === 1 ? '' : 's'}`
              : 'Unknown lock state'}
          </span>
        </TableCell>

        <TableCell>{formatNumber(rebaseApr?.rebaseApr || 0)}%</TableCell>
        <TableCell>
          <div className="text-white text-[12px] flex gap-[3px]">
            <span>
              {formatNumber(formatUnits(lock.rebase_amount, 18)) || 0.0}
            </span>
            <span className="text-[#C9C9E2]">{token}</span>
          </div>
        </TableCell>
      </TableRow>

      <div className="min-992px:hidden pt-3 bg-[#FFFFFF08] rounded-[12px] mb-[6px]">
        <div className="flex flex-col gap-[6px] px-4 mb-4">
          <p className="text-[#C9C9E280] text-[8px] leading-[8.8px]">Lock</p>
          <div className="flex items-center gap-4">
            <img
              width={26}
              height={26}
              src="https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/8453/0x940181a94a35a4569e4529a3cdfb74e38fd98631/logo.svg"
              alt=""
            />
            <span className="text-[12px] text-white leading-[9.6px]">
              #{lock.id.toString()}
            </span>
          </div>
        </div>
        <div className="flex px-4 justify-between pb-3">
          <div className="flex flex-col gap-[6px]">
            <span className="text-[8px] leading-[8.8px] text-[#C9C9E299] ">
              {expiresAt && expiresAt > 0
                ? `Unlocked in ${expiresAt} day${expiresAt === 1 ? '' : 's'}`
                : `Locked for ${Math.abs(expiresAt as number)} day${expiresAt === 1 ? '' : 's'}`}
            </span>
            <div className="text-white text-[10px] leading-[11px] flex gap-[3px]">
              $
              {(
                Number(formatUnits(lock.amount, lock.decimals)) * +tokenPrice
              ).toFixed(2)}
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[8px] leading-[8.8px] text-[#C9C9E299] ">
              Rebase APR
            </span>
            <div className="text-white text-[10px] leading-[11px] flex gap-[3px]">
              <span>{formatNumber(rebaseApr?.rebaseApr || 0)}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[8px] leading-[8.8px] text-[#C9C9E299] ">
              Rebases
            </span>
            <div className="text-white text-[10px] leading-[11px] flex gap-[3px]">
              <span>
                {formatNumber(formatUnits(lock.rebase_amount, 18)) || 0.0}
              </span>
              <span className="text-[#C9C9E2]">{token}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
