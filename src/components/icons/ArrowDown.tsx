import * as React from "react";
import { SVGProps } from "react";
const SvgArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 -4.5 20 20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20 1.39 18.594 0 9.987 8.261l-.918-.881.005.005L1.427.045 0 1.414 9.987 11 20 1.39"
      fill="#000"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgArrowDown;
