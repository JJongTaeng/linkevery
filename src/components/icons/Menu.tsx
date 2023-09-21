import * as React from 'react';
import { SVGProps } from 'react';
const SvgMenu = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 7h3m13 0h-9M20 17h-3M4 17h9M4 12h16"
      stroke="#1C274C"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);
export default SvgMenu;
