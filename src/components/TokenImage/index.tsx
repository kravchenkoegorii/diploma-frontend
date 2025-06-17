import { useEffect, useState } from 'react';
import { UnknownTokenIcon } from '@/assets/icons/UnknownTokenIcon';
import { chains } from '@/constants/chains';
import { TChainId } from '@/types/chain';
import clsx from 'clsx';

type Props = {
  src?: string;
  className?: string;
  wrapperClassName?: string;
  size?: number;
  addWhiteRoundedBgAndInvert?: boolean;
  chainId?: TChainId;
};

export const TokenImage: React.FC<Props> = ({
  src,
  className,
  size = 26,
  addWhiteRoundedBgAndInvert,
  wrapperClassName,
  chainId,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const chain = chains.find(chain => chain.id === chainId);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsError(true);
  }, [src]);

  return (
    <div className={clsx('relative', wrapperClassName)}>
      {!isLoaded || isError ? (
        <UnknownTokenIcon width={size} height={size} className={className} />
      ) : (
        <>
          <span
            className={clsx(
              addWhiteRoundedBgAndInvert &&
                'flex justify-center items-center w-5 min-w-5 h-5 rounded-full bg-white',
              wrapperClassName
            )}
          >
            <img
              src={src}
              className={clsx(
                'transition-opacity duration-300',
                isLoaded ? 'block' : 'hidden',
                className,
                addWhiteRoundedBgAndInvert && 'invert'
              )}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsError(true)}
              width={size}
              height={size}
            />
          </span>
          {chain && (
            <img
              src={chain.image}
              alt={chain.title}
              className="absolute -bottom-1 -right-0.5 w-3 h-3 rounded-full bg-white p-[1px]"
            />
          )}
        </>
      )}
    </div>
  );
};
