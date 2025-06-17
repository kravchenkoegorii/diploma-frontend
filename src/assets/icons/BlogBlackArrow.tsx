import { SVGAttributes } from 'react';

export function BlogBlackArrow(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.33342 8L12.6667 8"
        stroke="#171717"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.00008 3.33329L12.6667 7.99996L8.00008 12.6666"
        stroke="#171717"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
