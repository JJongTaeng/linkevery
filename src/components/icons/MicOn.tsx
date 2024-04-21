import * as React from 'react';
import type { SVGProps } from 'react';
const SvgMicOn = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#1C274C"
      strokeWidth={1.5}
      d="M7 8a5 5 0 0 1 10 0v3a5 5 0 0 1-10 0z"
    />
    <path
      stroke="#1C274C"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M13.5 8H17M13.5 11H17M7 8h2M7 11h2M12 19v3"
    />
    <path
      fill="#1C274C"
      d="M20.75 10a.75.75 0 0 0-1.5 0zm-16 0a.75.75 0 0 0-1.5 0zm10.762 7.344a.75.75 0 1 0 .728 1.312zM19.25 10v1h1.5v-1zm-14.5 1v-1h-1.5v1zM12 18.25A7.25 7.25 0 0 1 4.75 11h-1.5A8.75 8.75 0 0 0 12 19.75zM19.25 11a7.25 7.25 0 0 1-3.738 6.344l.728 1.312A8.75 8.75 0 0 0 20.75 11z"
    />
  </svg>
);
export default SvgMicOn;
