import React, { useEffect } from 'react';
import { debounce } from 'throttle-debounce';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { statusActions } from 'store/features/statusSlice';
import { addRoomByDB, deleteAllMemberByDB } from 'store/thunk/roomThunk';
import { addUserByDB, getUserByDB } from 'store/thunk/userThunk';

import { storage } from 'service/storage/StorageService';

import { TOP_MENU_HEIGHT } from 'style/constants.ts';

import UsernameModal from 'pages/RoomPage/components/UsernameModal';
import ChatList from 'components/chat/ChatList';
import ChatForm from 'components/chat/ChatForm';
import TopMenuLayout from '../../components/layout/TopMenuLayout.tsx';
import LeftMenuLayout from '../../components/layout/LeftMenuLayout.tsx';
import { roomActions } from '../../store/features/roomSlice.ts';
import { useApp } from '../../hooks/useApp.ts';
import { userActions } from '../../store/features/userSlice.ts';
import { chatActions } from '../../store/features/chatSlice.ts';

const RoomPage = () => {
  const { connectionPeerEmitter, voicePeerEmitter, audioManager, app } =
    useApp();
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
  const { username, status, modalVisible, voiceStatus } = useAppSelector(
    (state) => ({
      status: state.status,
      username: state.user.username,
      voiceStatus: state.user.voiceStatus,
      modalVisible: state.status.usernameModalVisible,
    }),
  );

  useEffect(() => {
    const userKey = storage.getItem('userKey');
    if (username && roomName) {
      storage.setItem('roomName', roomName);
      dispatch(statusActions.setUsernameModalVisible(false));
      dispatch(addRoomByDB({ roomName, member: {} }));
      connectionPeerEmitter.sendConnectionConnectMessage({}); // socket join
      connectionPeerEmitter.sendConnectionJoinRoomMessage({
        roomName,
        userKey,
      }); // join
      dispatch(roomActions.setRoomName(roomName));
    } else {
      dispatch(statusActions.setUsernameModalVisible(true));
    }
    return () => {
      storage.setItem('voiceStatus', false);
      dispatch(roomActions.leaveRoom());
      dispatch(userActions.changeVoiceStatus(false));
      dispatch(userActions.changeScreenShareStatus(false));
      dispatch(chatActions.resetChatState());
      dispatch(statusActions.resetAllStatusState());

      connectionPeerEmitter.sendConnectionDisconnectMessage({ roomName });
      if (voiceStatus) {
        voicePeerEmitter.sendVoiceDisconnectMessage({ userKey });
      }
      app.rtcManager.clearAudioTrack();
      audioManager.removeAllAudio();
      app.rtcManager.clearVideoTrack();
      app.rtcManager.clearPeerMap();
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
      <TopMenuLayout />
      <div className={'main-content-container'}>
        <LeftMenuLayout />
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
