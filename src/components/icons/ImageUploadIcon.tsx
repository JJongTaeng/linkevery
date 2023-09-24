import * as React from 'react';
import { SVGProps } from 'react';
const SvgImageUploadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m2 12.5 1.752-1.533a2.3 2.3 0 0 1 3.14.105l4.29 4.29a2 2 0 0 0 2.564.222l.299-.21a3 3 0 0 1 3.731.225L21 18.5M15 5.5h3.5m0 0H22m-3.5 0V9m0-3.5V2"
      stroke="#1C274C"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <path
      d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12c0-1.128 0-2.122.02-3M12 2C7.286 2 4.929 2 3.464 3.464c-.424.425-.726.925-.94 1.536"
      stroke="#1C274C"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);
export default SvgImageUploadIcon;
