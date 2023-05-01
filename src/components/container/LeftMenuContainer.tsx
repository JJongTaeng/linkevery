import { Button, Form, Input, Modal, Switch } from 'antd';
import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RTC_MANAGER_TYPE } from '../../constants/protocol';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { audioManager } from '../../service/audio/AudioManager';
import { roomActions } from '../../store/features/roomSlice';
import { voiceActions } from '../../store/features/voliceSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import SvgMicOn from '../icons/MicOn';
import SvgMicOff from '../icons/MicOn2';

const LeftMenuContainer = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { dispatch: appDispatch, rtcVoiceManager } = useRef(
    AppServiceImpl.getInstance(),
  ).current;
  const dispatch = useAppDispatch();
  const { status, roomName } = useAppSelector((state) => ({
    status: state.voice.status,
    roomName: state.room.roomName,
  }));
  const [form] = Form.useForm();

  return (
    <Container>
      <div>
        {roomName && (
          <Switch
            checkedChildren={<SvgMicOn />}
            unCheckedChildren={<SvgMicOff />}
            defaultChecked={false}
            onChange={(value) => {
              if (value) {
                appDispatch.sendJoinRoomMessage({
                  roomName: roomName + '_voice',
                  rtcType: RTC_MANAGER_TYPE.RTC_VOICE,
                });
                dispatch(voiceActions.changeStatus(true));
              } else {
                appDispatch.sendVoiceDisconnectMessage({});
                rtcVoiceManager.clearPeerMap();
                audioManager.clearAllAudio();
                dispatch(voiceActions.changeStatus(false));
              }
            }}
          />
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
  svg {
    margin-top: 4px;
  }
  g {
    fill: white;
  }
`;

export default LeftMenuContainer;
