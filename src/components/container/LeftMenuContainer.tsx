import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { throttle } from 'throttle-debounce';
import { statusActions } from 'store/features/statusSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getRoomListByDB } from 'store/thunk/roomThunk';
import { mediaSize } from 'style/theme';
import CreateRoomModal from 'components/room/CreateRoomModal';
import MemberListContainer from 'components/room/MemberListContainer';
import RoomBadge from 'components/room/RoomBadge';
import { useApp } from 'hooks/useApp';
import { EVENT_NAME } from '../../constants/gtm';

const LeftMenuContainer = () => {
  const navigate = useNavigate();
  const { app } = useApp();
  const [roomCreateModalVisible, setRoomCreateModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  const {
    roomName: currentRoomName,
    roomList,
    leftMenuVisible,
  } = useAppSelector((state) => ({
    roomName: state.room.current.roomName,
    roomList: state.room.roomList,
    leftMenuVisible: state.status.leftMenuVisible,
  }));

  const changeLeftMenu = throttle(100, () => {
    if (window.innerWidth < mediaSize.tablet) {
      dispatch(statusActions.changeLeftMenuVisible(false));
    } else {
      dispatch(statusActions.changeLeftMenuVisible(true));
    }
  });

  useEffect(() => {
    dispatch(getRoomListByDB());
    window.addEventListener('load', changeLeftMenu);
    window.addEventListener('resize', changeLeftMenu);
  }, []);

  return (
    <Container $leftMenuVisible={leftMenuVisible}>
      <LeftLeftContainer>
        <div className={'room-list'}>
          {roomList.map((roomName) => (
            <RoomBadge
              onClick={() => {
                window.dataLayer.push({
                  event: EVENT_NAME.enterRoom,
                  roomName,
                });
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
              <Button onClick={() => setRoomCreateModalVisible(true)}>+</Button>
            )}
          </ControllerContainer>
        </div>
      </LeftLeftContainer>

      {currentRoomName && (
        <LeftRightContainer>
          <MemberListContainer />
        </LeftRightContainer>
      )}

      <CreateRoomModal
        open={roomCreateModalVisible}
        setOpen={setRoomCreateModalVisible}
      />
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
