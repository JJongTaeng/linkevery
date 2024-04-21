import React from 'react';
import styled from 'styled-components';
import { theme } from 'style/theme.ts';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  borderColor?: string;
}

const Divider = ({
  borderColor = theme.color.primary200,
  ...props
}: DividerProps) => {
  return <StyledDivider {...props} borderColor={borderColor} />;
};

const StyledDivider = styled.div<{ borderColor: string }>`
  border-bottom: 1px solid
    ${({ theme, borderColor }) =>
      borderColor ? borderColor : theme.color.primary200};
  width: 100%;
`;

export default Divider;
