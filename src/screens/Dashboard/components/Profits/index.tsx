import clsx from 'clsx';
import { IoMdArrowUp } from 'react-icons/io';

interface IProfitsProps {
  profits: number;
  profits24hAgo: number;
  stakedReward: number;
  tradingFee: number;
  votingReward: number;
}

export const Profits = ({
  profits,
  profits24hAgo,
  stakedReward,
  tradingFee,
  votingReward,
}: IProfitsProps) => {
  const growPercent = profits > 0 ? (profits24hAgo * 100) / profits - 100 : 0;

  const stakingRewardPercentage = (stakedReward / profits) * 100;
  const votingRewardPercentage = (votingReward / profits) * 100;
  const tradingFeePercentage = (tradingFee / profits) * 100;

  return (
    <div className="bg-[#FFFFFF08] p-4 rounded-[16px]">
      <div className="flex flex-col gap-3 mb-4 min-w-[170px] max-992px:border-b border-white/10 max-992px:pb-4">
        <span className="text-[#C9C9E280] font-[400] leading-[14.4px] ">
          Profits
        </span>
        <div className="flex items-end gap-[6px]">
          <span className="text-[32px] text-[#F9F9F9] leading-[28.8px]">
            ${profits.toFixed(2)}
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
        <div className="flex gap-[6px] justify-between text-gray-400 max-992px:text-[12px] text-sm">
          <div
            style={{
              width: `${stakingRewardPercentage || 33}%`,
              minWidth: '30%',
            }}
            className="flex flex-col justify-between relative"
          >
            <div className="bg-[#fff] z-[888] rounded-[100px] h-1" />
            <div className="absolute left-[6px] top-0 h-full w-[0.5px] bg-[#FFFFFF1A] " />
            <div className="ml-3 max-992px:mt-[10px] mt-4">
              <p className="self-start max-992px:text-[9px]">Staking reward</p>
              <p className="max-992px:text-[14px] text-xl text-white self-start">
                ${stakedReward.toFixed(2)}
              </p>
            </div>
          </div>

          <div
            style={{
              width: `${votingRewardPercentage || 33}%`,
              minWidth: '30%',
            }}
            className="flex flex-col justify-between relative"
          >
            <div className="bg-[#C9C9E2] z-[888] rounded-[100px] h-1" />
            <div className="absolute left-[6px] top-0 h-full w-[0.5px] bg-[#FFFFFF1A] " />
            <div className="ml-3">
              <p className="self-start max-992px:text-[9px]">Voting reward</p>
              <p className="max-992px:text-[14px] text-xl text-white self-start">
                ${votingReward.toFixed(2)}
              </p>
            </div>
          </div>

          <div
            style={{ width: `${tradingFeePercentage || 33}%`, minWidth: '20%' }}
            className="flex flex-col justify-between relative"
          >
            <div className="bg-[#FFEC3C] z-[888] rounded-[100px] h-1" />
            <div className="absolute left-[6px] top-0 h-full w-[0.5px] bg-[#FFFFFF1A] " />
            <div className="ml-3">
              <p className="self-start max-992px:text-[9px]">Trading fee</p>
              <p className="max-992px:text-[14px] text-xl text-white self-start">
                ${tradingFee.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
