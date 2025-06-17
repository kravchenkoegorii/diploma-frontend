import { HTMLAttributes, memo, SVGAttributes } from 'react';
import { useWindowSize } from 'usehooks-ts';
import clsx from 'clsx';
import { useBrowser } from '@/hooks/useBrowser';
import { gradientBg } from '@/assets/images';

export const Background = memo(
  (props: HTMLAttributes<HTMLImageElement> & SVGAttributes<SVGElement>) => {
    const { isSafari, isFirefox } = useBrowser();
    const { width } = useWindowSize();
    const isMobile = width <= 992;

    if (isSafari || isFirefox) {
      return (
        <img
          src={gradientBg}
          className={clsx(
            'mx-auto max-w-[4349px] w-[4349px] min-w-[4349px] min-h-[6650px] h-[6650px]',
            isMobile ? 'min-h-[5223px] h-[5223px]' : 'min-h-[6650px] h-[6650px]'
          )}
          alt=""
          {...props}
        />
      );
    }

    return (
      <svg
        width="7697"
        height={isMobile ? '5823' : '7423'}
        viewBox="0 0 6697 4523"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g>
          <g filter="url(#filter0_f_0_50)">
            <ellipse
              cx="2764"
              cy="1872"
              rx="411"
              ry="342"
              transform="rotate(-90 2764 1872)"
              fill="#281F31"
            />
          </g>
          <g filter="url(#filter1_f_0_50)">
            <ellipse
              cx="3844"
              cy="1077"
              rx="432"
              ry="354"
              fill="#4C3F1D"
              fillOpacity="0.4"
            />
          </g>
          <g filter="url(#filter2_f_0_50)">
            <path
              d="M3349 900C4011.74 900 4549 970.192 4549 1781.5C4549 3123.61 4011.74 3838 3349 3838C2686.26 3838 2149 3191.58 2149 1781.5C2149 970.192 2686.26 900 3349 900Z"
              fill="url(#paint0_linear_0_50)"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_0_50"
            x="1972"
            y="1011"
            width="1584"
            height="1722"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="225"
              result="effect1_foregroundBlur_0_50"
            />
          </filter>
          <filter
            id="filter1_f_0_50"
            x="2962"
            y="273"
            width="1764"
            height="1608"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="225"
              result="effect1_foregroundBlur_0_50"
            />
          </filter>
          <filter
            id="filter2_f_0_50"
            x="1699"
            y="450"
            width="3300"
            height="4238"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="225"
              result="effect1_foregroundBlur_0_50"
            />
          </filter>
          <linearGradient
            id="paint0_linear_0_50"
            x1="3349"
            y1="924.239"
            x2="3349"
            y2="1831.63"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF9900" />
            <stop offset="0.38" stopColor="#664686" />
            <stop offset="0.8" stopColor="#171717" />
          </linearGradient>
          <clipPath id="clip0_0_50">
            <rect width="6697" height="4223" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  },
  (prev, curr) => prev?.className === curr?.className
);
