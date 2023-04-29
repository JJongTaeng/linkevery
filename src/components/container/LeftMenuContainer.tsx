import { Button, Form, Input, Modal } from 'antd';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { roomActions } from '../../store/features/roomSlice';
import {
  UserStatus,
  userInfoActions,
} from '../../store/features/userInfoSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const LeftMenuContainer = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { dispatch: appDispatch } = AppServiceImpl.getInstance();
  const dispatch = useAppDispatch();
  const { status, roomName } = useAppSelector((state) => ({
    status: state.userInfo.status,
    roomName: state.room.roomName,
  }));
  const [form] = Form.useForm();

  return (
    <Container>
      <div>
        {roomName && (
          <Button
            onClick={() => {
              appDispatch.sendVoiceJoinMessage({});
              dispatch(userInfoActions.changeStatus(UserStatus.VOICE));
            }}
          >
            voice
          </Button>
        )}
      </div>
      <div>{!roomName && <Button onClick={() => setOpen(true)}>+</Button>}</div>
      <Modal
        title={'방 생성'}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => setOpen(false)}
        open={open}
      >
        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          onFinish={(values) => {
            const roomName = values.roomName + '_' + nanoid();
            dispatch(roomActions.setRoomName(roomName));
            form.resetFields();
            navigate(`/${roomName}`);
            setOpen(false);
          }}
          autoComplete="off"
        >
          <Form.Item
            label="이름"
            name="roomName"
            rules={[{ required: true, message: '방 이름을 입력해주세요~!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

const Container = styled.section`
  padding: 16px 0;
  height: 100%;
  width: 70px;
  background-color: ${({ theme }) => theme.color.primary100};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export default LeftMenuContainer;
