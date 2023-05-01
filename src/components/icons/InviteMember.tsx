import * as React from "react";
import { SVGProps } from "react";
const SvgInviteMember = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 19c.691-2.307 2.47-3 6.5-3 4.03 0 5.809.693 6.5 3"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="M13 9.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      stroke="#fff"
      strokeWidth={2}
    />
    <path
      d="M15 6h6M18 3v6"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgInviteMember;
