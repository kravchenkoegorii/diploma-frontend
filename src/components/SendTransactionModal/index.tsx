import { FC, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { sendTransaction, waitForTransactionReceipt } from 'wagmi/actions';
import { wagmiConfig } from '@/config/wagmiConfig';
import {
  Address,
  erc20Abi,
  Hash,
  isAddress,
  parseEther,
  parseUnits,
  zeroAddress,
} from 'viem';
import { base } from 'viem/chains';
import { usePrivy, useSendTransaction, useWallets } from '@privy-io/react-auth';
import { userStore } from '@/stores/user';
import toast from 'react-hot-toast';
import { BaseError, useWriteContract } from 'wagmi';
import { QRScanner } from './components/QRScanner';
import { LuScanQrCode } from 'react-icons/lu';
import { TOKENS } from '@/constants/sendTokens';
import { useChatsStore } from '@/stores/chats';
import { useShallow } from 'zustand/shallow';

interface ISendTransactionModalProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  children: React.ReactNode;
}

export const SendTransactionModal: FC<ISendTransactionModalProps> = ({
  children,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
}) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? localIsOpen;
  const setIsOpen = controlledSetIsOpen ?? setLocalIsOpen;
  const setOpenAccordion = useChatsStore(useShallow(s => s.setOpenAccordion));

  const [address, setAddress] = useState('');

  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { sendTransaction: sendTransactionWithEmbeddedWallet } =
    useSendTransaction();
  const { user } = usePrivy();
  const { wallets: privyWallets } = useWallets();
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [isOpenedTokensList, setIsOpenedTokensList] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const handleSend = async () => {
    if (!address || !amount || !user) return;

    try {
      setIsSending(true);
      if (!isAddress(address)) {
        throw new Error('Invalid address');
      }

      if (+amount <= 0) {
        throw new Error('Invalid amount');
      }

      const { userData } = userStore.getState();

      const wallets = userData?.wallets || [];
      const defaultWallet = wallets.find(w => w.isDefault);

      if (!defaultWallet) {
        throw new Error('No wallet found');
      }

      const wallet = privyWallets.find(
        w => w.address === defaultWallet.address
      );
      const isEmbedded = wallet?.connectorType === 'embedded';

      let hash: Hash | undefined;
      if (selectedToken.address === zeroAddress) {
        if (isEmbedded) {
          const { hash: txHash } = await sendTransactionWithEmbeddedWallet({
            to: address as Address,
            value: parseEther(amount),
            chainId: base.id,
          });
          hash = txHash;
        } else {
          hash = await sendTransaction(wagmiConfig, {
            to: address as Address,
            value: parseEther(amount),
            chainId: base.id,
          });
        }
      } else {
        if (!user.wallet) {
          throw new Error('User wallet is undefined');
        }
        const txHash = await writeContractAsync({
          abi: erc20Abi,
          address: selectedToken.address as Address,
          functionName: 'transfer',
          args: [address, parseUnits(amount, selectedToken.decimals)],
        });

        hash = txHash;
      }

      await waitForTransactionReceipt(wagmiConfig, {
        hash,
      });

      setOpenAccordion(null);

      toast.success(
        <div className="flex flex-col gap-2">
          <div>Transaction sent successfully</div>
          <div>
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View in Explorer
            </a>
          </div>
        </div>
      );
      handleOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(
        (error as BaseError).shortMessage || (error as BaseError).message
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenChange = async (value: boolean) => {
    setIsOpen(value);

    if (value) return;

    setAmount('');
    setAddress('');
    setIsCameraOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay className="fixed inset-0 backdrop-blur-[3px] z-[1200]" />
            <DialogContent asChild>
              <motion.div
                initial={{ y: '-50%', x: '-50%', opacity: 0, height: 0 }}
                animate={{ y: '-50%', x: '-50%', opacity: 1, height: 'auto' }}
                exit={{ y: '-50%', x: '-50%', opacity: 0, height: 'auto' }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="fixed top-1/2 left-1/2 z-[1201] flex justify-center items-center w-full max-w-[360px] max-h-[calc(100svh_-_32px)] px-4 pb-4 bg-[var(--privy-color-background)] rounded-[var(--privy-border-radius-lg)] shadow-[0px_8px_36px_rgba(55,65,81,0.15)] leading-[1.15] text-[var(--privy-color-foreground-2)] overflow-auto scrollbar-hidden outline-none"
              >
                <div className="flex flex-col w-full">
                  <div className="flex justify-end items-center py-4">
                    <DialogClose
                      onClick={() => setOpenAccordion(null)}
                      aria-label="close modal"
                      className="flex items-center justify-center rounded-full border border-solid border-[var(--privy-color-accent-light)] opacity-60 p-1 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        height="16px"
                        width="16px"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </DialogClose>
                  </div>
                  <h1 className="text-[var(--privy-color-foreground)] leading-[1.875rem] font-semibold text-[1.125rem] text-center">
                    Send
                  </h1>
                  <p className="mt-1 text-[var(--privy-color-foreground)] text-[0.875rem] text-center leading-[1.375rem] font-normal">
                    Withdraw Tokens from Crypto app to another wallet
                  </p>
                  <div className="flex justify-start items-center py-2 px-4 w-full mt-4 border border-solid border-[var(--privy-color-foreground-4)] rounded-[var(--privy-border-radius-md)]">
                    <label className="flex flex-col gap-1 w-full">
                      <span className="text-[0.75rem] leading-[1.125rem] font-medium text-[var(--privy-color-foreground-3)]">
                        Wallet address
                      </span>
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          className="w-full min-w-none grow max-w-full bg-transparent text-[100%] outline-none placeholder:text-[var(--privy-color-foreground-4)]"
                          placeholder="0x"
                          value={address}
                          disabled={isSending}
                          onChange={e => setAddress(e.target.value)}
                        />
                        <button
                          onClick={() => {
                            if (isCameraOpen) {
                              setIsCameraOpen(false);
                            } else {
                              setIsCameraOpen(true);
                            }
                            setAddress('');
                          }}
                        >
                          <LuScanQrCode className="text-[20px] hover:opacity-50 cursor-pointer duration-300" />
                        </button>
                      </div>
                      <QRScanner
                        setInputValue={setAddress}
                        isCameraOpen={isCameraOpen}
                        setIsCameraOpen={setIsCameraOpen}
                        inputValue={address}
                      />
                    </label>
                  </div>
                  <div className="flex justify-start items-center py-2 px-4 w-full mt-4 border border-solid border-[var(--privy-color-foreground-4)] rounded-[var(--privy-border-radius-md)]">
                    <label className="flex flex-col gap-1 w-full">
                      <span className="text-[0.75rem] leading-[1.125rem] font-medium text-[var(--privy-color-foreground-3)]">
                        Amount
                      </span>
                      <input
                        type="number"
                        className="w-full min-w-none grow max-w-full bg-transparent text-[100%] outline-none placeholder:text-[var(--privy-color-foreground-4)] input-number"
                        placeholder="0.0001"
                        value={amount}
                        disabled={isSending}
                        onChange={e => setAmount(e.target.value)}
                      />
                    </label>
                    <span className="py-0.5 font-medium text-[var(--privy-color-foreground-2)]">
                      <DropdownMenu.Root
                        open={isOpenedTokensList}
                        onOpenChange={isOpen => setIsOpenedTokensList(isOpen)}
                      >
                        <DropdownMenu.Trigger
                          onClick={() => setIsOpenedTokensList(true)}
                          className="data-[state=open]:border-b-[0px]"
                        >
                          <img
                            width={20}
                            height={20}
                            src={selectedToken.icon || TOKENS[0].icon}
                            className="cursor-pointer hover:opacity-60 duration-300 border-b-none"
                          />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content className="z-[1300]">
                            <div className="bg-[#1d1d1f] flex flex-col gap-2 border border-white/20 shadow-lg px-5 py-2 rounded-[16px] mt-3">
                              {TOKENS.map(token => (
                                <DropdownMenu.Item key={token.address}>
                                  <img
                                    src={token.icon}
                                    width={20}
                                    height={20}
                                    className="focus:outline-none hover:opacity-50 duration-300  cursor-pointer"
                                    onClick={() => setSelectedToken(token)}
                                  />
                                </DropdownMenu.Item>
                              ))}
                            </div>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </span>
                  </div>
                  <button
                    className="flex justify-center items-center gap-1.5 w-full h-11 mt-4 bg-[rgb(102,110,255)] hover:bg-[rgb(71,81,255)] rounded-lg text-base text-white font-medium cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    disabled={!address || !amount || isSending}
                    onClick={handleSend}
                  >
                    {isSending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
