import * as React from 'react';
import { SVGProps } from 'react';
const SvgInviteMember = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={10} cy={6} r={4} stroke="#1C274C" strokeWidth={1.5} />
    <path
      d="M21 10h-2m0 0h-2m2 0V8m0 2v2M17.997 18c.003-.164.003-.331.003-.5 0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5S2 22 10 22c2.231 0 3.84-.157 5-.437"
      stroke="#1C274C"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);
export default SvgInviteMember;
