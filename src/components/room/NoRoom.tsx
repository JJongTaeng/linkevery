import { Button } from 'antd';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { storage } from 'service/storage/StorageService';
import { roomActions } from 'store/features/roomSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { addUserByDB, getUserByDB } from 'store/thunk/userThunk';
import { TOP_MENU_HEIGHT } from 'style/constants';
import { ColorsTypes, SizeTypes, theme } from 'style/theme';
import CreateRoomModal from './CreateRoomModal';
import UsernameModal from './UsernameModal';
import { statusActions } from '../../store/features/statusSlice';
import GoogleDisplay from '../googleAd/GoogleDisplay';

const NoRoom = () => {
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
    <>
      <NoRoomContent>
        {username && (
          <div>
            <Text bold={true} size={'xxl'} color={'primary100'}>
              <p>{username && username}님</p>
              <p>안녕하세요</p>
            </Text>
          </div>
        )}
        <div>
          <span className={'no-room-description'}>
            <p>
              <Button onClick={() => setOpen(true)}>+</Button> 으로 방을
              생성하거나
            </p>
            <p>친구로 초대받은 링크로 접속해주세요!</p>
          </span>
        </div>
        <GoogleDisplay
          className={''}
          adClient={'ca-pub-5575580268159871'}
          adSlot={'3987400403'}
          adFormat={'auto'}
          fullWidthResponsive={'true'}
        />
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
    </>
  );
};

const NoRoomContent = styled.div`
  width: 100%;
  height: calc(100% - ${TOP_MENU_HEIGHT}px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 16px;

  & > div {
    margin-bottom: 20px;
  }

  .no-room-description {
    font-size: ${({ theme }) => theme.size.lg}px;
    .ant-btn-default:not(:disabled) {
      cursor: auto;
    }
    p {
      text-align: center;
    }
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

export default NoRoom;
