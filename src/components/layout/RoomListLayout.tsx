import React from 'react';
import styled from 'styled-components';

interface RoomListLayoutProps {
  roomList: string[];
}

const RoomListLayout = ({ roomList }: RoomListLayoutProps) => {
  return <Container></Container>;
};

const Container = styled.nav`
  width: 72px;
  height: 100%;
  flex-shrink: 0;

  background-color: ${({ theme }) => theme.color.primary100};
`;

export default RoomListLayout;
