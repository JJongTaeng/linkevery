import styled from 'styled-components';
import { ColorsTypes, SizeTypes } from './theme';

export const Text = styled.span<{
  size: keyof SizeTypes;
  color: keyof ColorsTypes;
  bold: boolean;
}>`
  font-size: ${({ size }) => size}px;
  color: ${({ color }) => color};
  font-weight: ${({ bold }) => (bold ? 'bold' : 400)};
`;
