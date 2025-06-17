import { SVGAttributes } from 'react';

export function TrendingUp(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.25 4.5L10.125 11.625L6.375 7.875L0.75 13.5"
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 4.5H17.25V9"
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
