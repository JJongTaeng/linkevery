import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { storage } from 'service/storage/StorageService';
import { chatActions } from 'store/features/chatSlice';
import { roomActions } from 'store/features/roomSlice';
import { statusActions } from 'store/features/statusSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { deleteAllMemberByDB, getRoomByDB } from 'store/thunk/roomThunk';
import { addUserByDB, getUserByDB } from 'store/thunk/userThunk';
import UsernameModal from './UsernameModal';
import { useApp } from 'hooks/useApp';
import ChatForm from './ChatForm';
import ChatList from '../chat/ChatList';
import { debounce } from 'throttle-debounce';
import { nanoid } from 'nanoid';

const Room = () => {
  const { app, connectionDispatch } = useApp();
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
  const storeDispatch = useAppDispatch();

  useEffect(() => {
    if (username && roomName) {
      storage.setItem('roomName', roomName);
      dispatch(statusActions.setUsernameModalVisible(false));
      connectionDispatch.sendConnectionConnectMessage({}); // socket join
      connectionDispatch.sendConnectionJoinRoomMessage({ roomName }); // join
      storeDispatch(roomActions.setRoomName(roomName));
      storeDispatch(getRoomByDB(roomName));
    } else {
      dispatch(statusActions.setUsernameModalVisible(true));
    }
    return () => {
      app.disconnect();
      storeDispatch(chatActions.resetChatList());
      storeDispatch(statusActions.resetAllStatusState());
    };
  }, [username, roomName]);

  const handleUsernameSubmit = (username: string) => {
    const key = nanoid();
    storeDispatch(addUserByDB({ username, key }));
    storeDispatch(getUserByDB());
    storage.setItem('userKey', key);
    storage.setItem('username', username);
    dispatch(statusActions.setUsernameModalVisible(true));
  };

  useEffect(() => {
    storeDispatch(getUserByDB());
    window.addEventListener('beforeunload', async () => {
      roomName && storeDispatch(deleteAllMemberByDB({ roomName }));
    });
    window.visualViewport?.addEventListener('resize', handleViewportResize);
    window.visualViewport?.addEventListener('scroll', handleViewportResize);
    return () => {
      roomName && storeDispatch(deleteAllMemberByDB({ roomName }));
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
    <>
      <RoomContent $leftMenuVisible={status.leftMenuVisible}>
        <ContentContainer>
          <ChatContainer>
            <ChatList />
            <ChatForm />
          </ChatContainer>
        </ContentContainer>
        <UsernameModal open={modalVisible} onSubmit={handleUsernameSubmit} />
      </RoomContent>
    </>
  );
};

const RoomContent = styled.div<{ $leftMenuVisible: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

const ChatContainer = styled.div`
  width: 100%;
  min-width: 30%;
  padding: 8px;

  position: relative;
`;

export default Room;
