import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { OtherDrag } from '@/assets/icons/OtherDrag';
import { ChartToken } from '../types';
import { ScrollArea } from '@/components/ScrollArea';

type CustomDropdownProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  otherTokens?: ChartToken[];
  currentChainId: number;
  getChainInfo: (chainId: number) => { title: string; image: string } | null;
};

export const CustomDropdown = ({
  currentChainId,
  otherTokens,
  getChainInfo,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative mb-4">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="group flex justify-between items-center w-full cursor-pointer hover:opacity-70 duration-300 touch-action-manipulation"
      >
        <div className="flex items-center gap-[6px]">
          <OtherDrag />
          <span className="text-[#FFFFFF80] text-[14px] leading-[12.6px]">
            Other
          </span>
        </div>
        <div
          className={clsx(
            'w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[3px] border-[#FFFFFF80] transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]',
            isOpen ? 'rotate-0' : 'rotate-180'
          )}
        ></div>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-3 bg-[#2B2B31] border-[.5px] border-white/10 rounded-[10px] pl-1 py-1 w-[181px] shadow-lg overflow-hidden">
          <ScrollArea className="flex flex-col max-h-[116px] overflow-auto">
            {otherTokens?.map((entry, index) => {
              const chainInfo = getChainInfo(entry.chainId);
              return (
                <div
                  key={index}
                  className="flex flex-col justify-between py-1 text-[14px] text-white cursor-default px-2 rounded hover:bg-white/10"
                >
                  <div className="w-full flex justify-between">
                    <div className="flex items-center gap-[6px]">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>{entry.name}</span>
                    </div>
                    <span>{entry.value.toFixed(1)}%</span>
                  </div>

                  {currentChainId === -1 && chainInfo && (
                    <div className="ml-4 flex items-center gap-2 text-[10px] text-gray-400">
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
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
