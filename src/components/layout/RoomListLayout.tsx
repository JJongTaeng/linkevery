import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Divider from 'components/elements/Divider.tsx';

interface RoomListLayoutProps {
  roomList: { name: string; id: string }[];
  selectedRoomId: string;
  onClickRoom: (room: { name: string; id: string }) => void;
}

const RoomListLayout = ({
  roomList,
  selectedRoomId,
  onClickRoom,
}: RoomListLayoutProps) => {
  const navigate = useNavigate();
  return (
    <Container>
      <RoomList>
        <RoomItem
          onClick={() => {
            navigate('/');
          }}
          selected={false}
        >
          Home
        </RoomItem>
        <Divider />
        {roomList.map((room) => (
          <RoomItem
            selected={selectedRoomId === room.id}
            onClick={() => {
              onClickRoom(room);
            }}
          >
            <RoomText>{room.name}</RoomText>
          </RoomItem>
        ))}
      </RoomList>
    </Container>
  );
};

const Container = styled.nav`
  width: 72px;
  height: 100%;
  flex-shrink: 0;

  background-color: ${({ theme }) => theme.color.primary100};
`;

const RoomList = styled.ul`
  width: 100%;
  padding-top: 8px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
`;

const RoomItem = styled.div<{ selected: boolean }>`
  padding: 4px;
  width: 48px;
  height: 48px;
  border-radius: ${({ selected }) => (selected ? '50%' : '4px')};
  font-size: 0.8em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, selected }) =>
    selected ? theme.color.blue400 : theme.color.white};

  color: ${({ theme, selected }) =>
    selected ? theme.color.white : theme.color.dark100};

  cursor: pointer;

  &:hover {
    border-radius: 50%;
  }
  transition: 0.3s;
`;

const RoomText = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
`;

export default RoomListLayout;
