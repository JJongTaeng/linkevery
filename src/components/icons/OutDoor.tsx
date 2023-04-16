import * as React from "react";
import { SVGProps } from "react";
const SvgOutDoor = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 1v19h12v-4h-1v3H1V2h10v3h1V1H0zm15 6 3 3H5v1h13l-3 3h1.5l3.5-3.5L16.5 7H15z"
      style={{
        fillOpacity: 1,
        stroke: "none",
        strokeWidth: 0,
      }}
    />
  </svg>
);
export default SvgOutDoor;
