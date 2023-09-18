import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { storage } from 'service/storage/StorageService';
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
import { useLocalEmitter } from '../../hooks/useLocalEmitter';

const Room = () => {
  const { app, connectionPeerEmitter } = useApp();
  const { roomLocalEmitter } = useLocalEmitter();
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
      connectionPeerEmitter.sendConnectionConnectMessage({}); // socket join
      connectionPeerEmitter.sendConnectionJoinRoomMessage({ roomName }); // join
      dispatch(roomActions.setRoomName(roomName));
      dispatch(getRoomByDB(roomName));
    } else {
      dispatch(statusActions.setUsernameModalVisible(true));
    }
    return () => {
      roomLocalEmitter.leave();
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
