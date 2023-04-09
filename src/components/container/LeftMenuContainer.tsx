import React from 'react';
import styled from 'styled-components';
import RoomBadge from '../room/RoomBadge';

const LeftMenuContainer = () => {
  return (
    <Container>
      <RoomBadge roomName="hello" />
    </Container>
  );
};

const Container = styled.section`
  height: 100%;
  width: 70px;
  background-color: ${({ theme }) => theme.color.grey100};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default LeftMenuContainer;
