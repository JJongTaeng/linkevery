import React, { useEffect } from 'react';
import { debounce } from 'throttle-debounce';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { nanoid } from 'nanoid';

import { useEmitter } from 'hooks/useEmitter';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { statusActions } from 'store/features/statusSlice';
import { deleteAllMemberByDB } from 'store/thunk/roomThunk';
import { addUserByDB, getUserByDB } from 'store/thunk/userThunk';

import { storage } from 'service/storage/StorageService';

import { TOP_MENU_HEIGHT } from 'style/constants.ts';

import UsernameModal from 'pages/RoomPage/components/UsernameModal';
import ChatList from 'components/chat/ChatList';
import ChatForm from 'components/chat/ChatForm';
import TopMenuContainer from 'components/container/TopMenuContainer.tsx';
import LeftMenuContainer from 'components/container/LeftMenuContainer.tsx';

const RoomPage = () => {
  const { roomEmitter } = useEmitter();
  const dispatch = useAppDispatch();
  const handleViewportResize = debounce(
    50,
    (e: any) => {
      window.scrollTo(0, document.body.scrollHeight - e.target.height);
    },
    {},
  );

  const { roomName } = useParams<{
    roomName: string;
  }>();
  const { username, status, modalVisible } = useAppSelector((state) => ({
    status: state.status,
    username: state.user.username,
    modalVisible: state.status.usernameModalVisible,
  }));

  useEffect(() => {
    if (username && roomName) {
      storage.setItem('roomName', roomName);
      dispatch(statusActions.setUsernameModalVisible(false));
      roomEmitter.joinRoom();
    } else {
      dispatch(statusActions.setUsernameModalVisible(true));
    }
    return () => {
      roomEmitter.leave();
    };
  }, [username, roomName]);

  const handleUsernameSubmit = (username: string) => {
    const key = nanoid();
    dispatch(addUserByDB({ username, key }));
    dispatch(getUserByDB());
    storage.setItem('userKey', key);
    storage.setItem('username', username);
    dispatch(statusActions.setUsernameModalVisible(true));
  };

  useEffect(() => {
    dispatch(getUserByDB());
    window.addEventListener('beforeunload', async () => {
      roomName && dispatch(deleteAllMemberByDB({ roomName }));
    });
    window.visualViewport?.addEventListener('resize', handleViewportResize);
    window.visualViewport?.addEventListener('scroll', handleViewportResize);
    return () => {
      roomName && dispatch(deleteAllMemberByDB({ roomName }));
      window.visualViewport?.removeEventListener(
        'resize',
        handleViewportResize,
      );
      window.visualViewport?.removeEventListener(
        'scroll',
        handleViewportResize,
      );
    };
  }, []);

  return (
    <Container>
      <TopMenuContainer />
      <div className={'main-content-container'}>
        <LeftMenuContainer />
        <ContentSection>
          <RoomContent $leftMenuVisible={status.leftMenuVisible}>
            <ContentContainer>
              <ChatContainer>
                <ChatList />
                <ChatForm />
              </ChatContainer>
            </ContentContainer>
            <UsernameModal
              open={modalVisible}
              onSubmit={handleUsernameSubmit}
            />
          </RoomContent>
        </ContentSection>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.color.white};
  .main-content-container {
    width: 100%;
    height: calc(100% - ${TOP_MENU_HEIGHT}px);
    display: flex;
  }
`;

const ContentSection = styled.section`
  width: 100%;
  height: 100%;

  overflow: auto;
`;

const RoomContent = styled.div<{ $leftMenuVisible: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 30%;
  padding: 8px;
`;

export default RoomPage;
