import { Profits } from '../Profits';
import { TotalChart } from '../TotalChart';
import { userService } from '@/services/userService';
import { Address } from 'viem';
import useSWR from 'swr';
import { CgSpinnerAlt } from 'react-icons/cg';
import { useUserStore } from '@/stores/user';
import { useShallow } from 'zustand/shallow';
import { useAppStore } from '@/stores/app';
import { chains } from '@/constants/chains';

export const Summary = () => {
  const defaultWallet = useUserStore(
    useShallow(s => s.userData?.wallets.find(w => w.isDefault))
  );
  const currentChain = useAppStore(useShallow(s => s.currentChain));

  const { data: summaryData, isLoading } = useSWR(
    defaultWallet?.address && currentChain?.id
      ? [`/api/dex/positions/summary`, defaultWallet.address, currentChain.id]
      : null,
    () =>
      userService.getDexPositionsSummary(
        defaultWallet?.address as Address,
        currentChain.id === -1
          ? chains.filter(chain => chain.id !== -1).map(chain => chain.id)
          : [currentChain.id]
      )
  );

  return (
    <>
      <div className="pb-[26px] px-[22px] text-[24px] text-white leading-[26.4px] font-[400]">
        Droms summary
      </div>
      <div className="flex flex-col gap-[6px] p-[6px]">
        {isLoading || !summaryData ? (
          <div className="flex justify-center">
            <CgSpinnerAlt className="text-white text-[35px] animate-spin" />
          </div>
        ) : (
          <>
            {summaryData && (
              <>
                <TotalChart
                  unstaked={summaryData?.unstaked || 0}
                  staked={summaryData?.staked || 0}
                  totalDeposited24hAgo={summaryData?.totalDeposited24hAgo || 0}
                  totalDepositedCurrent={
                    summaryData?.totalDepositedCurrent || 0
                  }
                />
                <Profits
                  profits={summaryData.profits || 0}
                  profits24hAgo={summaryData.profits24hAgo || 0}
                  stakedReward={summaryData.stakedReward || 0}
                  votingReward={summaryData.votingReward || 0}
                  tradingFee={summaryData.tradingFee || 0}
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
