import { LockIcon } from '@/assets/icons/txIcons/LockIcon';
import { ReceivedIcon } from '@/assets/icons/txIcons/ReceivedIcon';
import { SendIcon } from '@/assets/icons/txIcons/SendIcon';
import { StakeIcon } from '@/assets/icons/txIcons/StakeIcon';
import { SwapIcon } from '@/assets/icons/txIcons/SwapIcon';
import { UnlockIcon } from '@/assets/icons/txIcons/UnlockIcon';
import { UnstakeIcon } from '@/assets/icons/txIcons/UnstakeIcon';
import { VoteIcon } from '@/assets/icons/txIcons/VoteIcon';
import { Tooltip } from '@/components/Tooltip';
import { TransactionType, TxHistory } from '@/types/transactions';
import capitalize from 'lodash/capitalize';

type Props = {
  tx: TxHistory;
};

export const TxElemtnt: React.FC<Props> = ({ tx }) => {
  const txTypes = Object.values(TransactionType);
  const getTooltipContent = (title: string, type: string) => {
    const lowerTitle = title.toLowerCase();

    for (const type of txTypes) {
      if (lowerTitle.startsWith(type)) {
        return title;
      }
    }

    if (type === 'Vote' || type === 'Swap' || type === 'Lock')
      return ` ${title}`;

    return `${capitalize(type)} ${title}`;
  };

  const getTxIcon = (txType: TransactionType) => {
    switch (txType) {
      case TransactionType.Lock:
        return <LockIcon />;
      case TransactionType.Unlock:
        return <UnlockIcon />;
      case TransactionType.Stake:
        return <StakeIcon />;
      case TransactionType.Unstake:
        return <UnstakeIcon />;
      case TransactionType.Sent:
        return <SendIcon />;
      case TransactionType.Receive:
        return <ReceivedIcon />;
      case TransactionType.Vote:
        return <VoteIcon />;
      case TransactionType.Swap:
        return <SwapIcon />;

      default:
        break;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp)
      .toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(',', '');
  };

  const roundUsdAmount = (num: number, decimals: number) => {
    const factor = 10 ** decimals;
    return Math.floor(num * factor) / factor;
  };

  return (
    <Tooltip
      triggerProps={{
        asChild: true,
      }}
      tooltip={getTooltipContent(tx?.title, tx?.type)}
    >
      <div
        key={tx?.txHash}
        className="flex justify-between items-center py-4 border-b border-[#FFFFFF0F] gap-3 w-full"
      >
        <div className="flex gap-6 items-center w-full">
          <div className="flex items-center justify-center rounded-[6px] bg-white-6 min-h-6 min-w-6">
            {getTxIcon(tx.type)}
          </div>

          <div className="flex gap-[3px] items-end">
            <span className="block text-[14px] leading-[12.6px] text-white truncate max-992px:max-w-[100px] max-w-[150px] capitalize">
              {tx.type}
            </span>

            {tx.type !== TransactionType.Vote && (
              <span className="text-[10px] leading-[10px] text-[#FFFFFF99]">
                ${roundUsdAmount(tx?.amountUsd || 0, 2)}
              </span>
            )}
          </div>
        </div>

        <div className="w-fit">
          <span className="text-[14px] text-[#FFFFFF80] leading-[12.6px] text-nowrap">
            {formatTimestamp(tx?.timestamp)}
          </span>
        </div>
      </div>
    </Tooltip>
  );
};
