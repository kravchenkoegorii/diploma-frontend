import { SVGAttributes } from 'react';

export function BlackArrow(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20.8213 9.03366L2.8644 9.03366L11.4755 1.08066L10.4147 0.108886L0.00816879 9.72018L10.4147 19.3315L11.4755 18.3597L2.8644 10.4067L20.8213 10.4067L20.8213 9.03366Z"
        fill="#171717"
      />
    </svg>
  );
}
