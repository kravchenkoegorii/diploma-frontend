import { userService } from '@/services/userService';
import { useEffect, useState } from 'react';
import { CgSpinnerAlt } from 'react-icons/cg';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useMediaQuery } from '@mui/material';
import { TxElemtnt } from './components/TxElement';
import { TxHistory } from '@/types/transactions';
import { useAppStore } from '@/stores/app';
import { useShallow } from 'zustand/shallow';
import { chains } from '@/constants/chains';
import { chainsConfig } from '@/constants/chains/chainsConfig';

export const TransactionList = ({
  walletAddress,
}: {
  walletAddress: string;
}) => {
  const [transactions, setTransactions] = useState<TxHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isTablet = useMediaQuery('(min-width: 922px) and (max-width: 1400px)');
  const currentChain = useAppStore(useShallow(s => s.currentChain));

  useEffect(() => {
    const fetchInitialTransactions = async () => {
      try {
        setIsLoading(true);
        const { transactions, total, currentPage } =
          await userService.getTransactions(
            walletAddress,
            1,
            10,
            currentChain.id === -1
              ? chains.filter(chain => chain.id !== -1).map(chain => chain.id)
              : currentChain.id
          );
        setTransactions(transactions);
        setCurrentPage(currentPage);
        setHasMore(transactions.length > 0 && transactions.length < total);
      } catch (error) {
        console.error('Error with getting txs history: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialTransactions();
  }, [walletAddress, currentChain.id]);

  const loadMore = async () => {
    const {
      transactions: newTransactions,
      total,
      currentPage: newPage,
    } = await userService.loadMoreTransactions(
      walletAddress,
      currentPage,
      10,
      currentChain.id
    );

    setTransactions(prev => [...prev, ...newTransactions]);
    setCurrentPage(newPage);
    setHasMore(transactions.length + newTransactions.length < total);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <CgSpinnerAlt className="mt-4 text-white text-[35px] animate-spin" />
        </div>
      ) : transactions.length > 0 ? (
        <InfiniteScroll
          dataLength={transactions.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center w-full">
              <CgSpinnerAlt className="animate-spin text-[#fff] text-[25px]" />
            </div>
          }
          height={isTablet ? 570 : 278}
          className="overflow-y-auto pb-6 pt-[10px] px-8 flex flex-col scrollbar-hidden w-full"
        >
          {transactions?.map(tx => <TxElemtnt tx={tx} />)}

          {!hasMore && currentChain.id !== -1 && (
            <a
              href={`${chainsConfig[currentChain.id]?.scanBaseUrl}/address/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer flex justify-center gap-[9px] items-center grow w-full px-5 mt-6 py-4 rounded-[10px] bg-[#FFFFFF0F] text-sm text-[#C9C9E2]"
            >
              Show more
            </a>
          )}
        </InfiniteScroll>
      ) : (
        <div className="text-center max-992px:text-[11px] mt-6 text-white/70">
          You don't have any transactions yet
        </div>
      )}
    </>
  );
};
