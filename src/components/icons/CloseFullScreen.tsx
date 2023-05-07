import * as React from "react";
import { SVGProps } from "react";
const SvgCloseFullScreen = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20 15a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1h4ZM4 15h4a1 1 0 0 1 .993.883L9 16v4a1 1 0 0 1-1.993.117L7 20v-3H4a1 1 0 0 1-.117-1.993L4 15h4-4ZM16 3a1 1 0 0 1 .993.883L17 4v3h3a1 1 0 0 1 .117 1.993L20 9h-4a1 1 0 0 1-.993-.883L15 8V4a1 1 0 0 1 1-1ZM8 3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h3V4a1 1 0 0 1 1-1Z"
      fill="#212121"
      fillRule="nonzero"
    />
  </svg>
);
export default SvgCloseFullScreen;
