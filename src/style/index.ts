import { keyframes } from 'styled-components';

export const highlight = keyframes`
  0% {
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 255, .0);
  }
  100% {
    box-shadow: 0px 0px 4px 4px rgba(0, 0, 255, .5);
  }
`;
