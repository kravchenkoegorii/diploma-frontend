import { NetworksIcon } from '@/assets/icons/NetworksIcon';
import { ScrollArea } from '@/components/ScrollArea';
import { chains } from '@/constants/chains';
import { useAppStore } from '@/stores/app';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa6';

import { useShallow } from 'zustand/shallow';

export const NetworkSelect = () => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [currentChain, setCurrentChain] = useAppStore(
    useShallow(s => [s.currentChain, s.setCurrentChain])
  );

  useEffect(() => {
    const handleScroll = () => setIsOpenDropdown(false);

    if (isOpenDropdown) {
      window.addEventListener('scroll', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpenDropdown]);

  return (
    <DropdownMenu.Root
      modal={false}
      open={isOpenDropdown}
      onOpenChange={setIsOpenDropdown}
    >
      <DropdownMenu.Trigger
        onPointerDown={e => {
          e.preventDefault();
          setIsOpenDropdown(prev => !prev);
        }}
        className="relative group data-[state=open]:border-none bg-[#171717] bg-opacity-[36%] py-[10px] pr-[33px] pl-[13px] h-[26px] rounded-[8px] flex justify-between items-center w-full cursor-pointer font-radio hover:opacity-70 duration-300"
      >
        <div className="flex gap-4 mr-2 items-center">
          <div className="p-1 bg-[#FFFFFF1A] rounded-[4px]">
            <NetworksIcon />
          </div>
          <span className="text-[#C9C9E2] text-[14px] leading-[90%]">
            {currentChain.title}
          </span>
        </div>
        {currentChain.id === -1 ? (
          <div className="flex items-center justify-center">
            <img
              width={20}
              height={20}
              src="https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/8453/0x940181a94a35a4569e4529a3cdfb74e38fd98631/logo.svg"
              alt=""
              className="relative z-[1] drop-shadow-[0px_0px_4px_#23232329]"
            />
            <img
              width={20}
              height={20}
              src="https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens//10/0x9560e827af36c94d2ac33a39bce1fe78631088db/logo.svg"
              alt=""
              className="-ml-[3px] relative z-[0]"
            />
          </div>
        ) : (
          <img
            width={20}
            height={20}
            src={currentChain.image}
            className="rounded-full"
          />
        )}
        <div
          className={clsx(
            'w-0 h-0 absolute right-[17px] border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[3px] border-[#FFFFFF80] transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]',
            'group-data-[state=open]:rotate-0 rotate-180'
          )}
        ></div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mt-1 w-[var(--radix-dropdown-menu-trigger-width)] bg-[#2B2B31] border-[.5px] border-white/10 rounded-[10px] pl-2 py-0 max-992px:w-[60vw] min-w-[270px] shadow-lg overflow-hidden">
          <ScrollArea
            className="flex flex-col max-h-[var(--radix-dropdown-menu-content-available-height)] min-h-[112px] overflow-auto"
            viewPortClassName="py-3"
          >
            {chains.map(chain => (
              <DropdownMenu.Item
                key={chain.id}
                onClick={() => setCurrentChain(chain)}
                className="hover:opacity-60 duration-300 cursor-pointer flex justify-between items-center py-1 text-[14px] text-white px-2 rounded outline-none"
              >
                <div className="flex gap-2 items-center">
                  {chain.id === -1 ? (
                    <div className="flex">
                      <img
                        width={20}
                        height={20}
                        src="https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/8453/0x940181a94a35a4569e4529a3cdfb74e38fd98631/logo.svg"
                        alt=""
                        className="relative z-[1] drop-shadow-[0px_0px_4px_#23232329]"
                      />
                      <img
                        width={20}
                        height={20}
                        src="https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens//10/0x9560e827af36c94d2ac33a39bce1fe78631088db/logo.svg"
                        alt=""
                        className="-ml-[3px] relative z-[0]"
                      />
                    </div>
                  ) : (
                    <img
                      width={20}
                      height={20}
                      src={chain.image}
                      alt=""
                      className="rounded-full"
                    />
                  )}
                  <span>{chain.title}</span>
                </div>
                {chain.title === currentChain.title && (
                  <FaCheck className="text-[#70c861]" />
                )}
              </DropdownMenu.Item>
            ))}
          </ScrollArea>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
