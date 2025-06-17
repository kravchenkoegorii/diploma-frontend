import { SVGAttributes } from 'react';

export function ArrowUpRight(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_1660_394"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="14"
        height="14"
      >
        <rect width="14" height="14" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_1660_394)">
        <path
          d="M3.67165 10.2925L3.0625 9.68333L8.80279 3.9375H3.58415V3.0625H10.2925V9.77083H9.41748V4.55219L3.67165 10.2925Z"
          fill="#C9C9E2"
        />
      </g>
    </svg>
  );
}
