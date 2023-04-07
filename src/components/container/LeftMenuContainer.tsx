import React from 'react';
import styled from 'styled-components';

const LeftMenuContainer = () => {
  return <Container></Container>;
};

const Container = styled.section`
  height: 100%;
  width: 70px;
  background-color: ${({ theme }) => theme.color.grey100};
`;

export default LeftMenuContainer;
