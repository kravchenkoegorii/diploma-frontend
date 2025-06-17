import { SVGAttributes } from 'react';

export function ExpandIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="9"
      height="10"
      viewBox="0 0 9 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_2846_943"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="9"
        height="10"
      >
        <rect y="0.5" width="9" height="9" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2846_943)">
        <path
          d="M1.875 7.625V5.375H2.625V6.875H4.125V7.625H1.875ZM6.375 4.625V3.125H4.875V2.375H7.125V4.625H6.375Z"
          fill="white"
          fillOpacity="0.6"
        />
      </g>
    </svg>
  );
}
