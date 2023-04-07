import React from 'react';
import styled from 'styled-components';
import { TOP_MENU_HEIGHT } from '../../style/constants';

const TopMenuContainer = () => {
  return <Container></Container>;
};

const Container = styled.div`
  width: 100%;
  height: ${TOP_MENU_HEIGHT}px;
  background-color: ${({ theme }) => theme.color.grey200};
`;

export default TopMenuContainer;
