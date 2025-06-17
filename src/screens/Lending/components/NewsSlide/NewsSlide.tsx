import { TokenImage } from '@/components/TokenImage';
import { chains } from '@/constants/chains';
import { TChainId } from '@/types/chain';
import { formatNumber } from '@/utilities/number';
import clsx from 'clsx';
import { FC } from 'react';

interface INewsSlideProps {
  image1: string;
  image2: string;
  title: string;
  poolType: number;
  apr: string;
  tvl: string;
  chainId: TChainId;
}

export const NewsSlide: FC<INewsSlideProps> = ({
  image1,
  image2,
  title,
  poolType,
  apr,
  tvl,
  chainId,
}) => {
  const neededChain = chains.find(chain => chain.id === chainId);

  return (
    <div className="cursor-grab active:cursor-grabbing px-6 py-4 w-full rounded-2xl bg-white bg-opacity-[0.16] backdrop-blur-[60px] flex flex-col justify-end shadow-sm">
      <div className="flex flex-row items-center gap-4">
        <div className="flex items-center">
          <TokenImage
            addWhiteRoundedBgAndInvert={false}
            src={`https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/${chainId}/${image1.toLowerCase()}/logo.svg`}
            size={44}
            wrapperClassName={clsx('w-[44px] h-[44px]', false)}
          />
          <TokenImage
            addWhiteRoundedBgAndInvert={false}
            src={`https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/${chainId}/${image2.toLowerCase()}/logo.svg`}
            size={44}
            wrapperClassName={clsx(
              '-translate-x-[25%] w-[44px] h-[44px]',
              false
            )}
          />
        </div>
        <div className="flex flex-col gap-1 items-start">
          <div className="flex flex-row gap-4 text-base">{title}</div>
          <span className="mb-1 rounded text-xs bg-gray-100 bg-opacity-50 px-2 text-gray-700">
            {(poolType || 0) > 0 ? 'Concentrated' : 'Basic'}{' '}
            {poolType === 0 ? 'Stable' : 'Volatile'}
          </span>
          <div className="flex w-full text-xs gap-1">
            <span className=" text-[#40942f] flex flex-row items-center">
              APR {Number(apr).toFixed(1)}%
            </span>
            /<span className="opacity-70">TVL ${formatNumber(tvl)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[12px] text-black/60">
        on
        <img
          src={neededChain?.image}
          className="bg-white p-[1px] rounded-full w-4 max-w-4 h-4"
        />
        <span>{neededChain?.title}</span>
      </div>
    </div>
  );
};
