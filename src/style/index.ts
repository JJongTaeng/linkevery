import { keyframes } from 'styled-components';

export const highlight = keyframes`
  0% {
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 255, .0);
  }
  100% {
    box-shadow: 0px 0px 4px 4px rgba(0, 0, 255, .5);
  }
`;

export const selectedAnimation = keyframes`
	0% {
    background: linear-gradient(-45deg, #9c27b0, #74efff, #9c27b0, #74efff);
    background-size: 400% 400%;
		background-position: 0% 0%;
	}
	100% {
    background: linear-gradient(-45deg, #9c27b0, #74efff, #9c27b0, #74efff);
    background-size: 400% 400%;
		background-position: 100% 100%;
	}
`;
