import { Button, Form, Input, Modal, Switch, Tooltip } from 'antd';
import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { roomActions } from '../../store/features/roomSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import SvgMicOn from '../icons/MicOn';
import SvgMicOff from '../icons/MicOn2';
import SvgScreenShareOff from '../icons/ScreenShareOff';
import SvgScreenShareOn from '../icons/ScreenShareOn';

const LeftMenuContainer = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const app = useRef(AppServiceImpl.getInstance()).current;
  const dispatch = useAppDispatch();
  const { voiceStatus, screenShareStatus, roomName, member } = useAppSelector(
    (state) => ({
      member: state.room.member,
      voiceStatus: state.room.voiceStatus,
      screenShareStatus: state.room.screenShareStatus,
      roomName: state.room.roomName,
    }),
  );
  const [form] = Form.useForm();

  const isOnVoiceMember = () => {
    for (const key in member) {
      if (member[key].voiceStatus) {
        return true;
      }
    }
  };

  return (
    <Container>
      <ControllerContainer>
        {roomName && (
          <Tooltip defaultOpen={true} placement="right" title="음성채팅">
            <Switch
              checked={voiceStatus}
              style={{ marginBottom: 8 }}
              checkedChildren={<SvgMicOn />}
              unCheckedChildren={<SvgMicOff />}
              defaultChecked={false}
              onChange={(value) => {
                dispatch(roomActions.changeVoiceStatus(value));
                if (value) {
                  app.dispatch.sendVoiceJoinMessage({});
                  dispatch(roomActions.changeVoiceStatus(true));
                } else {
                  app.disconnectVoice();
                  dispatch(roomActions.changeScreenShareStatus(false));
                  dispatch(roomActions.changeVoiceStatus(false));
                }
              }}
            />
          </Tooltip>
        )}
        {roomName && voiceStatus && (
          <Tooltip defaultOpen={true} placement="right" title="화면공유">
            <Switch
              disabled={!isOnVoiceMember()}
              checked={screenShareStatus}
              checkedChildren={<SvgScreenShareOn />}
              unCheckedChildren={<SvgScreenShareOff />}
              defaultChecked={false}
              onChange={(value) => {
                if (value) {
                  app.dispatch.sendScreenShareReadyMessage({});
                } else {
                  app.disconnectScreenShare();
                  dispatch(roomActions.changeScreenShareStatus(false));
                }
              }}
            />
          </Tooltip>
        )}
      </ControllerContainer>
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
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.color.primary100} 40%,
    ${({ theme }) => theme.color.primary400} 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  svg {
    margin-top: 4px;
  }
  g {
    fill: white;
  }
`;

const ControllerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default LeftMenuContainer;
