import { TokenImage } from '@/components/TokenImage';
import { TChainId } from '@/types/chain';

export const TokenIcons = ({
  token0,
  token1,
  token0Symbol,
  token1Symbol,
  chainId,
}: {
  token0: string;
  token1: string;
  token0Symbol?: string;
  token1Symbol?: string;
  chainId?: TChainId;
}) => {
  const getTokenImage = (token: string) =>
    token
      ? `https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/${chainId}/${token.toLowerCase()}/logo.svg`
      : undefined;

  return (
    <div className="relative flex items-center">
      <TokenImage
        src={getTokenImage(token1)}
        size={26}
        className="rounded-full"
        wrapperClassName="flex -ml-[3px] min-w-[26px] w-[26px] h-[26px]"
        addWhiteRoundedBgAndInvert={false}
        chainId={chainId}
      />
    </div>
  );
};
