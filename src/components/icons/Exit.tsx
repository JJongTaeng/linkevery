import * as React from 'react';
import { SVGProps } from 'react';
const SvgExit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 16c0 2.828 0 4.243.879 5.121.641.642 1.568.815 3.121.862M8 8c0-2.828 0-4.243.879-5.121C9.757 2 11.172 2 14 2h1c2.828 0 4.243 0 5.121.879C21 3.757 21 5.172 21 8v8c0 2.828 0 4.243-.879 5.121-.768.769-1.946.865-4.121.877M3 9.5v5c0 2.357 0 3.535.732 4.268.732.732 1.911.732 4.268.732M3.732 5.232C4.464 4.5 5.643 4.5 8 4.5"
      stroke="#1C274C"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <path
      d="M6 12h9m0 0-2.5 2.5M15 12l-2.5-2.5"
      stroke="#1C274C"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgExit;
