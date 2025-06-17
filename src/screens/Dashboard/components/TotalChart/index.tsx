import clsx from 'clsx';
import { IoMdArrowUp } from 'react-icons/io';

interface ITotalChartProps {
  unstaked: number;
  staked: number;
  totalDeposited24hAgo: number;
  totalDepositedCurrent: number;
}

export const TotalChart = ({
  unstaked,
  staked,
  totalDeposited24hAgo,
  totalDepositedCurrent,
}: ITotalChartProps) => {
  const growPercent =
    totalDepositedCurrent > 0
      ? (totalDeposited24hAgo * 100) / totalDepositedCurrent - 100
      : 0;

  const unstakedPercentage = (unstaked / totalDepositedCurrent) * 100;
  const stakedPercentage = (staked / totalDepositedCurrent) * 100;

  return (
    <div className="bg-[#FFFFFF08] p-4 rounded-[16px]">
      <div className="flex flex-col gap-3 mb-4 min-w-[170px] max-992px:border-b border-white/10 max-992px:pb-4">
        <span className="text-[#C9C9E280] font-[400] leading-[14.4px] ">
          Total deposited amount
        </span>
        <div className="flex items-end gap-[6px]">
          <span className="text-[32px] text-[#F9F9F9] leading-[28.8px]">
            ${totalDepositedCurrent.toFixed(2)}
          </span>
          <div
            className={clsx(
              'flex items-center gap-[2px] text-[10px]',
              growPercent > 0 ? 'text-[#64CE88]' : 'text-[#E64054]'
            )}
          >
            <IoMdArrowUp
              className={clsx(
                'text-[11px]',
                growPercent > 0 ? 'rotate-[45deg]' : 'rotate-[-135deg]'
              )}
            />
            {growPercent > 0 ? '+' : ''}
            {growPercent.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="relative w-full mx-auto text-white">
        <div className="flex gap-[6px] justify-between text-gray-400 text-sm">
          <div
            style={{ width: `${unstakedPercentage || 50}%`, minWidth: '20%' }}
            className="flex flex-col justify-between relative"
          >
            <div className="absolute left-[6px] top-0 h-full w-[0.5px] bg-[#FFFFFF1A] " />
            <div className="ml-3">
              <p className="self-start">Unstaked</p>
              <p className="text-xl text-white self-start">
                ${unstaked.toFixed(2)}
              </p>
            </div>
            <div className="bg-[#171717] z-[888] rounded-[100px] h-1 mt-1" />
          </div>

          <div
            style={{ width: `${stakedPercentage || 50}%`, minWidth: '20%' }}
            className="flex flex-col justify-between relative"
          >
            <div className="absolute left-[6px] top-0 h-full w-[0.5px] bg-[#FFFFFF1A] " />
            <div className="ml-3 max-992px:mb-[10px] mb-[42px]">
              <p className="self-start">Staked</p>
              <p className="text-xl text-white self-start">
                ${staked.toFixed(2)}
              </p>
            </div>
            <div className="bg-[#fff] z-[888] rounded-[100px] h-1 max-992px:mt-0 mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
