import { SVGAttributes } from 'react';

export function WhiteArrow(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M-1.96701e-07 5.5L8.08467 5.5L4.28717 9.2975L5 10L10 5L5 -2.18557e-07L4.28717 0.702499L8.08467 4.5L-2.40413e-07 4.5L-1.96701e-07 5.5Z"
        fill="white"
      />
    </svg>
  );
}
