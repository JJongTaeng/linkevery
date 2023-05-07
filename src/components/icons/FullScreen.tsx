import * as React from "react";
import { SVGProps } from "react";
const SvgFullScreen = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M33 6h9v9M42 33v9h-9M15 42H6v-9M6 15V6h9"
      stroke="#000"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgFullScreen;
