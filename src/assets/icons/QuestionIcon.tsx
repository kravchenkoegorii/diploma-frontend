import { SVGAttributes } from 'react';

export function QuestionIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.23171 5.15986C4.23171 4.18391 5.10976 4.4088 5.10976 3.77655C5.10976 3.49649 4.90576 3.32252 4.55543 3.32252C4.17406 3.32252 3.94789 3.51347 3.86807 3.90809L3.5 3.83171C3.60643 3.32252 3.9745 3.00003 4.5643 3.00003C5.14967 3.00003 5.5 3.31403 5.5 3.73836C5.5 4.54458 4.56874 4.35788 4.56874 5.15986V5.232H4.23171V5.15986Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="M4.21397 6.00003V5.56297H4.59534V6.00003H4.21397Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <circle
        cx="4.5"
        cy="4.5"
        r="4"
        stroke="currentColor"
        strokeOpacity="0.6"
      />
    </svg>
  );
}
