import styled from 'styled-components';
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
