import * as React from "react";
import { SVGProps } from "react";
const SvgSpeakerOn = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19 6c1.5 1.5 2 4 2 6s-.5 4.5-2 6m-3-9c.5.5 1 1.5 1 3s-.5 2.5-1 3M3 10.5v3c0 1.105.5 2 2.5 2.5S9 21 12 21c2 0 2-18 0-18-3 0-4.5 4.5-6.5 5S3 9.395 3 10.5Z"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgSpeakerOn;
