import { Button } from 'antd';
import { useEffect } from 'react';
import styled from 'styled-components';
import { StorageService } from '../../service/storage/StorageService';
import { useAppSelector } from '../../store/hooks';
import { Text } from '../../style';
import { TOP_MENU_HEIGHT } from '../../style/constants';
import TopMenuContainer from '../container/TopMenuContainer';

const storage = StorageService.getInstance();

const NoRoom = () => {
  const username = useAppSelector((state) => state.room.username);

  useEffect(() => {
    storage.setItem('roomName', '');
  }, [username]);

  return (
    <>
      <TopMenuContainer />
      <NoRoomContent>
        <div>
          <Text bold={true} size={'xxl'} color={'primary100'}>
            {username && username + '님 안녕하세요.'}
          </Text>
        </div>
        <div>
          <span className={'no-room-description'}>
            좌측 하단 <Button>+</Button> 버튼으로 방을 생성하거나 다른 친구로
            부터 받은 링크로 접속해주세요.
          </span>
        </div>
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

  & > div {
    margin-bottom: 20px;
  }

  .no-room-description {
    font-size: ${({ theme }) => theme.size.lg}px;
    .ant-btn-default:not(:disabled) {
      cursor: auto;
    }
    .ant-btn-default:not(:disabled):hover {
      color: rgba(0, 0, 0, 0.88);
      background-color: #ffffff;
      border-color: #d9d9d9;
    }
  }
`;

export default NoRoom;
