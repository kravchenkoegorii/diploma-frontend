import { SVGAttributes } from 'react';

export function BurgerIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <mask
        id="mask0_1924_776"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_1924_776)">
        <path
          d="M3.5 16.4422V14.9422H16.625V16.4422H3.5ZM5.43275 12.75V11.25H18.5577V12.75H5.43275ZM7.375 9.05774V7.55774H20.5V9.05774H7.375Z"
          fill="#C9C9E2"
          fillOpacity="0.6"
        />
      </g>
    </svg>
  );
}
