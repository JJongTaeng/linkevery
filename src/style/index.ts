import styled, { keyframes } from 'styled-components';
import { ColorsTypes, SizeTypes, theme } from './theme';

export const Text = styled.span<{
  size: keyof SizeTypes;
  color: keyof ColorsTypes;
  bold: boolean;
}>`
  font-size: ${({ size }) => theme.size[size]}px;
  color: ${({ color }) => theme.color[color]};
  font-weight: ${({ bold }) => (bold ? 'bold' : 400)};
`;

export const highlight = keyframes`
  0% {
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 255, .0);
  }
  100% {
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 255, .5);
  }
`;
