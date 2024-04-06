import { Button } from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { TOP_MENU_HEIGHT } from 'style/constants';
import { ColorsTypes, SizeTypes, theme } from 'style/theme';

import { statusActions } from 'store/features/statusSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { roomActions } from 'store/features/roomSlice';
import { addUserByDB, getUserByDB } from 'store/thunk/userThunk';

import { storage } from 'service/storage/StorageService';

import TopMenuContainer from 'components/container/TopMenuContainer.tsx';
import LeftMenuContainer from 'components/container/LeftMenuContainer.tsx';
import UsernameModal from 'pages/RoomPage/components/UsernameModal';
import CreateRoomModal from 'pages/RoomPage/components/CreateRoomModal';

const LobbyPage = () => {
  const { username, usernameModalVisible } = useAppSelector((state) => ({
    username: state.user.username,
    usernameModalVisible: state.status.usernameModalVisible,
  }));
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    storage.setItem('roomName', '');
    dispatch(roomActions.setRoomName(''));

    if (!username) {
      dispatch(statusActions.setUsernameModalVisible(true));
    } else {
      dispatch(statusActions.setUsernameModalVisible(false));
    }
  }, [username]);

  useEffect(() => {
    dispatch(getUserByDB()); // get user info [userkey, username
  }, []);

  return (
    <Container>
      <TopMenuContainer />
      <div className={'main-content-container'}>
        <LeftMenuContainer />
        <ContentSection>
          <NoRoomContent>
            <Description>
              {username && (
                <div>
                  <Text bold={true} size={'xxl'} color={'primary100'}>
                    <p>{username && username}님</p>
                    <p>안녕하세요</p>
                  </Text>
                </div>
              )}
              <div>
                <span>
                  <p>
                    <Button onClick={() => setOpen(true)}>+</Button> 으로 방을
                    생성하거나
                  </p>
                  <p>친구로 초대받은 링크로 접속해주세요!</p>
                </span>
              </div>
            </Description>
            <UsernameModal
              open={usernameModalVisible}
              onSubmit={(username) => {
                const key = nanoid();
                dispatch(addUserByDB({ username, key }));
                dispatch(getUserByDB());
                storage.setItem('userKey', key);
                storage.setItem('username', username);
                dispatch(statusActions.setUsernameModalVisible(false));
              }}
            />
            <CreateRoomModal open={open} setOpen={setOpen} />
          </NoRoomContent>
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

const NoRoomContent = styled.div`
  width: 100%;
  height: calc(100% - ${TOP_MENU_HEIGHT}px);
  display: flex;
`;

const Description = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: ${({ theme }) => theme.size.lg}px;
  .ant-btn-default:not(:disabled) {
    cursor: auto;
  }
  p {
    text-align: center;
  }
`;

const Text = styled.span<{
  size: keyof SizeTypes;
  color: keyof ColorsTypes;
  bold: boolean;
}>`
  font-size: ${({ size }) => theme.size[size]}px;
  color: ${({ color }) => theme.color[color]};
  font-weight: ${({ bold }) => (bold ? 'bold' : 400)};
  p {
    margin-bottom: 8px;
    text-align: center;
  }
`;

export default LobbyPage;
