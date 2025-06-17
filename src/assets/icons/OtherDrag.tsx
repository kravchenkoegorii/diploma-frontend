import { SVGAttributes } from 'react';

export function OtherDrag(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="2" cy="2" r="1" fill="white" fillOpacity="0.26" />
      <circle cx="6" cy="2" r="1" fill="white" fillOpacity="0.26" />
      <circle cx="2" cy="6" r="1" fill="white" fillOpacity="0.26" />
      <circle cx="6" cy="6" r="1" fill="white" fillOpacity="0.26" />
    </svg>
  );
}
