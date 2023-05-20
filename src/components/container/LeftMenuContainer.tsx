import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getRoomListByDB } from '../../store/thunk/roomThunk';
import CreateRoomModal from '../room/CreateRoomModal';
import MemberListContainer from '../room/MemberListContainer';
import RoomBadge from '../room/RoomBadge';

const LeftMenuContainer = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const app = useRef(AppServiceImpl.getInstance()).current;
  const dispatch = useAppDispatch();
  const {
    roomName: currentRoomName,
    roomList,
    leftMenuVisible,
  } = useAppSelector((state) => ({
    roomName: state.room.room.roomName,
    roomList: state.room.roomList,
    leftMenuVisible: state.ui.leftMenuVisible,
  }));

  useEffect(() => {
    dispatch(getRoomListByDB());
  }, []);

  return (
    <Container $leftMenuVisible={leftMenuVisible}>
      <LeftLeftContainer>
        <div className={'room-list'}>
          {roomList.map((roomName) => (
            <RoomBadge
              onClick={() => {
                currentRoomName !== roomName && app.disconnect();
                navigate('/' + roomName);
              }}
              name={roomName}
              key={roomName}
            />
          ))}
        </div>

        <div>
          <ControllerContainer>
            {!currentRoomName && (
              <Button onClick={() => setOpen(true)}>+</Button>
            )}
          </ControllerContainer>
        </div>
      </LeftLeftContainer>

      {currentRoomName && (
        <LeftRightContainer>
          <MemberListContainer />
        </LeftRightContainer>
      )}

      <CreateRoomModal open={open} setOpen={setOpen} />
    </Container>
  );
};

const LeftLeftContainer = styled.div`
  height: 100%;
  width: 70px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.primary100};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.color.primary100} 40%,
    ${({ theme }) => theme.color.primary400} 100%
  );
  .room-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: overlay;
    width: 100%;
    height: 100%;
  }
`;

const LeftRightContainer = styled.div`
  height: 100%;
  padding: 8px;
`;

const Container = styled.section<{ $leftMenuVisible: boolean }>`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: ${({ $leftMenuVisible }) => ($leftMenuVisible ? '' : '0px')};
  transform: ${({ $leftMenuVisible }) => ($leftMenuVisible ? '' : 'scaleX(0)')};
  ${({ theme, $leftMenuVisible }) => theme.media.mobile`
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    position: fixed;
    width: ${$leftMenuVisible ? '100%' : '0px'};  
    transform: ${$leftMenuVisible ? '' : 'scaleX(0)'};
    height: calc(100% - 50px);
    ${LeftRightContainer} {
      width: 100%;
      .member-list {
        width: 100%;
      }
    }
  `}
  transform-origin: left;
  transition: 0.2s;
  svg {
    margin-top: 4px;
  }
  g {
    fill: white;
  }

  .room-list::-webkit-scrollbar {
    display: none;
  }
`;

const ControllerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default LeftMenuContainer;
