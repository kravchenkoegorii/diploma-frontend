import { usePrivy } from '@privy-io/react-auth';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { useShallow } from 'zustand/shallow';
import { AccountIcon } from '../../../../../../assets/icons/AccountIcon';
import { CopyButton } from '../../../../../../components/CopyButton';
import { useUserStore } from '../../../../../../stores/user';
import { formatAddress } from '../../../../../../utilities/formatAddress';
import './styles.css';
import { X } from '../../../../../../assets/icons/X';
import { isCreatedWithTelegram, isCreatedWithTwitter } from '@/utilities/privy';
import { SocialsEnum } from '@/types/socials';
import { CgSpinnerAlt } from 'react-icons/cg';
import { LogInButton } from '@/components/LogInButton';
import { useLayoutEffect, useState } from 'react';
import { BsTelegram } from 'react-icons/bs';
import { Address } from 'viem';

interface IDropdownProps {
  address: string | undefined;
  onLogin: () => void;
  onClickSosial: (val: SocialsEnum) => void;

  handleLogout(): void;
}

const UserMenu = ({
  address,
  onLogin,
  onClickSosial,
  handleLogout,
}: IDropdownProps) => {
  const { user, ready } = usePrivy();
  const isTwitterUnlinkDisabled = isCreatedWithTwitter(user);
  const isTelegramUnlinkDisabled = isCreatedWithTelegram(user);
  const [privyHasConnections, setPrivyHasConnections] = useState(false);
  const defaultWallet = useUserStore(
    useShallow(s => s.userData?.wallets.find(w => w.isDefault))
  );

  useLayoutEffect(() => {
    const updateFromStorage = () => {
      const storedData = localStorage.getItem('privy:refresh_token');
      const hasRefreshToen = !!storedData;

      if (hasRefreshToen) {
        setPrivyHasConnections(true);
      } else {
        setPrivyHasConnections(false);
      }
    };

    updateFromStorage();
  }, [user, ready, address]);

  if (!user && !privyHasConnections) {
    return <LogInButton disabled={!ready} onClick={onLogin} />;
  }

  return (
    <>
      <DropdownMenu.Root modal={false}>
        <div className="cursor-pointer flex items-center gap-[6px] p-[13px] pl-[26px] border-[0.5px] border-solid border-[#FFFFFF1A] rounded-full">
          {address && <CopyButton value={address as string}></CopyButton>}
          <DropdownMenu.Trigger
            className="usermenu-trigger flex items-center gap-[6px]"
            asChild
            disabled={!ready}
          >
            <button>
              {address ? (
                <div className="flex items-center gap-[6px] group">
                  <span className="cursor-pointer group-hover:opacity-70 transition duration-300 text-sm leading-none">
                    {formatAddress(address)}
                  </span>
                </div>
              ) : (
                <CgSpinnerAlt className="animate-spin" />
              )}
              <span
                className="inline-flex items-center justify-center rounded-full text-violet11 outline-none hover:bg-violet3"
                aria-label="Customize options"
              >
                <AccountIcon width={24} height={24} />
              </span>
            </button>
          </DropdownMenu.Trigger>
        </div>

        <DropdownMenu.Portal>
          {user && (
            <DropdownMenu.Content
              onPointerDown={e => e.stopPropagation()}
              className=" relative z-[1000] w-[191px] -translate-x-[9%] translate-y-[7%] DropdownMenuContent text-white min-w-[var(--radix-popper-anchor-width,_200px)] py-5 rounded-[23px] border-[.5px] border-white/10"
              sideOffset={8}
            >
              <div className="bg-[#222224] rounded-[23px] absolute z-[-1] inset-0 backdrop-blur-[10px] pointer-events-none" />
              <DropdownMenu.Item
                key={defaultWallet?.id}
                className="DropdownMenuItem outline-none cursor-pointer px-4 pb-4 border-b-[0.5px] border-white/10 text-[14px]"
              >
                {defaultWallet &&
                  formatAddress(defaultWallet?.address as Address)}
              </DropdownMenu.Item>
              <div className="p-[10px] flex flex-col gap-[5px] border-b-[0.5px] border-white/10">
                <DropdownMenu.Item
                  onClick={() => onClickSosial(SocialsEnum.TWITTER)}
                  disabled={isTwitterUnlinkDisabled}
                  className={clsx(
                    'rounded-[10px] hover:opacity-50 transition duration-300 outline-none cursor-pointer text-[14px] text-[#C9C9E2] p-[13px] bg-[#FFFFFF08] disabled:pointer-events-none',
                    isTwitterUnlinkDisabled && '!opacity-100 !cursor-default'
                  )}
                >
                  {!user.twitter ? (
                    <span className="flex gap-1 items-center">
                      Connect
                      <div className="p-[5px] bg-[#FFFFFF1A] rounded-[4px]">
                        <X width={10} height={10} />
                      </div>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <div className="p-[5px] bg-[#FFFFFF1A] rounded-[4px]">
                        <X width={10} height={10} />
                      </div>
                      {user.twitter.username}
                    </span>
                  )}
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onClick={() => onClickSosial(SocialsEnum.TELEGRAMM)}
                  disabled={isTelegramUnlinkDisabled}
                  className={clsx(
                    'rounded-[10px] hover:opacity-50 transition duration-300 outline-none cursor-pointer text-[14px] text-[#C9C9E2] p-[13px] bg-[#FFFFFF08] disabled:pointer-events-none',
                    isTelegramUnlinkDisabled && '!opacity-100 !cursor-default'
                  )}
                >
                  {!user.telegram ? (
                    <span className="flex gap-1 items-center">
                      <div className="p-[3px] bg-[#FFFFFF1A] rounded-[4px]">
                        <BsTelegram className="text-[14px]" />
                      </div>
                      Connect
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <div className="p-[3px] bg-[#FFFFFF1A] rounded-[4px]">
                        <BsTelegram className="text-[14px]" />
                      </div>
                      {user.telegram.username}
                    </span>
                  )}
                </DropdownMenu.Item>
              </div>
              <DropdownMenu.Item
                onClick={handleLogout}
                className="p-4 pb-0 DropdownMenuItem hover:text-red-700 text-red-500 rounded-[23px] transition duration-300 outline-none cursor-pointer text-sm"
              >
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          )}
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default UserMenu;
