import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CustomDropdown } from './CustomDropdown';
import { ChartToken } from '../types';
import { useAppStore } from '@/stores/app';
import { chains } from '@/constants/chains';

type Props = {
  mainTokens: ChartToken[];
  otherTokens?: ChartToken[];
};

export const AssetsList: React.FC<Props> = ({ mainTokens, otherTokens }) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const currentChain = useAppStore(useShallow(s => s.currentChain));

  const getChainInfo = (
    chainId: number
  ): { title: string; image: string } | null => {
    const chain = chains.find(c => c.id === chainId);
    return chain ? { title: chain.title, image: chain.image as string } : null;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsOpenDropdown(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative flex flex-col justify-center">
      {otherTokens?.length !== 0 && (
        <>
          <div className="border-b text-white border-white/10 pb-1 mt-3 mb-4 w-[146px]">
            {mainTokens?.map((entry, index) => {
              const chainInfo = getChainInfo(entry.chainId);
              return (
                <div key={index} className="flex flex-col mb-2">
                  <div className="flex items-center gap-[10px] last:mb-0 text-[14px]">
                    <div
                      style={{ backgroundColor: entry.color }}
                      className="rounded-[50%] w-[10px] h-[10px]"
                    ></div>
                    <span>{entry.name}</span>
                    <span className="ml-auto text-[14px] text-[#C9C9E299]">
                      {entry.value.toFixed(1)}%
                    </span>
                  </div>
                  {currentChain.id === -1 && chainInfo && (
                    <div className="ml-5 flex items-center gap-2 text-[10px] text-gray-400">
                      On
                      <img
                        src={chainInfo.image}
                        alt={chainInfo.title}
                        className="w-3 h-3 rounded-full bg-white p-[1px]"
                      />
                      <span>{chainInfo.title}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <CustomDropdown
            isOpen={isOpenDropdown}
            setIsOpen={setIsOpenDropdown}
            otherTokens={otherTokens}
            currentChainId={currentChain.id}
            getChainInfo={getChainInfo}
          />
        </>
      )}
    </div>
  );
};
