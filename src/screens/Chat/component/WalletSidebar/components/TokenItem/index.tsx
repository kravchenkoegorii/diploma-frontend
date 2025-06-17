import { UnknownTokenIcon } from '@/assets/icons/UnknownTokenIcon';
import { ScrollArea } from '@/components/ScrollArea';
import { chains } from '@/constants/chains';
import { ISuperchainToken } from '@/types/aerodrome';
import { formatNumber } from '@/utilities/number';

interface ITokenItemProps {
  token: ISuperchainToken;
  openItem: string | null;
  onToggle: (item: string | null) => void;
}

export const TokenItem = ({ token, openItem, onToggle }: ITokenItemProps) => {
  const isSingleChain = token.chains.length === 1;
  const singleChain = isSingleChain
    ? chains.find(c => c.id === token.chains[0].chainId)
    : null;

  const isOpen = openItem === token.symbol;

  return (
    <div
      key={token.symbol}
      className="w-full py-3 px-4 rounded-[6px] bg-[#FFFFFF08]"
    >
      <div className="w-full flex items-center gap-1.5 cursor-pointer">
        <div className="flex gap-1.5">
          {['ETH', 'USDC', 'WETH'].includes(token.symbol) ? (
            <img
              src={
                token.symbol === 'ETH'
                  ? 'https://aerodrome.finance/tokens/ETH.svg'
                  : token.symbol === 'USDC'
                    ? 'https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/10/0x0b2c639c533813f4aa9d7837caf62653d097ff85/logo.svg'
                    : 'https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/10/0x4200000000000000000000000000000000000006/logo.svg'
              }
              className="w-5 min-w-5 h-5 rounded-full"
            />
          ) : (
            <UnknownTokenIcon width={20} height={20} />
          )}

          <div className="flex flex-col">
            <div className="text-[#C9C9E2] text-sm font-radio">
              {token.symbol}
            </div>

            {isSingleChain && singleChain ? (
              <div className="flex items-center gap-1 text-[10px] text-[#FFFFFF99]">
                On
                <img
                  src={singleChain.image}
                  className="w-3 h-3 rounded-full bg-black p-[1px]"
                />
                <span>{singleChain.title}</span>
              </div>
            ) : (
              token.chains.length !== 0 && (
                <button
                  onClick={() => onToggle(isOpen ? null : token.symbol)}
                  className="data-[state=open]:border-none flex items-center gap-1 text-[10px] text-[#FFFFFF99] group"
                >
                  On {token.chains.length} networks
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 15.5a.75.75 0 0 1-.53-.22l-4.25-4.25a.75.75 0 1 1 1.06-1.06L12 13.69l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-.53.22Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col ml-auto text-right">
          <div className="text-white text-sm">
            {formatNumber(token.totalAmount)} {token.symbol}
          </div>
          <div className="text-white/60 font-radio font-normal text-[10px]">
            ${Math.floor(token.totalUSD * 100) / 100}
          </div>
        </div>
      </div>

      {!isSingleChain && isOpen && (
        <ScrollArea className="max-height-730px:max-h-[70px] max-h-[130px] overflow-y-auto flex flex-col gap-[6px] w-full mt-[10px] pl-6 pr-1 pb-0 text-white text-sm">
          {token.chains.map(chain => {
            const currentChain = chains.find(c => c.id === chain.chainId);
            return (
              <div
                key={chain.chainId}
                className="flex flex-col pb-[6px] border-b border-white/10"
              >
                <div className="flex justify-between items-center gap-[6px]">
                  <div className="flex items-center gap-[6px]">
                    <img
                      src={currentChain?.image}
                      className="w-3 min-w-3 h-3 bg-black p-[1px] rounded-full"
                    />
                    <span className="text-[10px] text-[#C9C9E2]">
                      {currentChain?.title}
                    </span>
                  </div>
                  <span className="text-[10px]">
                    {formatNumber(chain.amount)} {token.symbol}
                  </span>
                </div>
                <span className="flex justify-end leading-[100%] text-[10px] text-white/50">
                  ${Math.floor(chain.usdValue * 100) / 100}
                </span>
              </div>
            );
          })}
        </ScrollArea>
      )}
    </div>
  );
};
