import * as React from 'react';
import type { SVGProps } from 'react';
const SvgInviteMember = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={10} cy={6} r={4} stroke="#1C274C" strokeWidth={1.5} />
    <path
      stroke="#1C274C"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M21 10h-2m0 0h-2m2 0V8m0 2v2M17.998 18q.002-.246.002-.5c0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5S2 22 10 22c2.231 0 3.84-.157 5-.437"
    />
  </svg>
);
export default SvgInviteMember;
