import { Button, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { setUsername } from '../../features/room/roomSlice';
import { StorageService } from '../../service/storage/StorageService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Text } from '../../style';
import { TOP_MENU_HEIGHT } from '../../style/constants';
import TopMenuContainer from '../container/TopMenuContainer';

const storage = StorageService.getInstance();

const NoRoom = () => {
  const [open, setOpen] = useState(false);
  const username = useAppSelector((state) => state.room.username);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!username) setOpen(true);
    storage.setItem('roomName', '');
  }, [username]);

  return (
    <>
      <Modal
        closable={false}
        footer={
          <>
            <Button type="primary" onClick={() => form.submit()}>
              등록
            </Button>
          </>
        }
        title={'사용자 이름 등록'}
        open={open}
      >
        <Form
          form={form}
          onFinish={({ username }) => {
            dispatch(setUsername({ username }));
            storage.setItem('username', username);
            setOpen(false);
          }}
        >
          <Form.Item
            name="username"
            label="사용자명"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <TopMenuContainer />
      <NoRoomContent>
        <Text bold={true} size={'md'} color={'grey100'}>
          {username && username + '님 안녕하세요.'}
        </Text>
        <span className={'no-room-description'}>방에 입장해주세요 ~</span>
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

  .no-room-description {
    margin-left: 12px;
  }
`;

export default NoRoom;
