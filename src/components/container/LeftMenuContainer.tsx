import {
  Button,
  Form,
  Input,
  Modal,
  Switch,
  Tooltip,
  notification,
} from 'antd';
import Bowser from 'bowser';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { mdUtils } from '../../service/media/MediaDeviceUtils';
import { videoManager } from '../../service/media/VideoManager';
import { roomActions } from '../../store/features/roomSlice';
import { userActions } from '../../store/features/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addRoomByDB, getRoomListByDB } from '../../store/thunk/roomThunk';
import SvgMicOn from '../icons/MicOn';
import SvgMicOff from '../icons/MicOn2';
import SvgScreenShareOff from '../icons/ScreenShareOff';
import SvgScreenShareOn from '../icons/ScreenShareOn';
import RoomBadge from '../room/RoomBadge';

const agentInfo = Bowser.parse(window.navigator.userAgent);

const LeftMenuContainer = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const app = useRef(AppServiceImpl.getInstance()).current;
  const dispatch = useAppDispatch();
  const {
    voiceStatus,
    screenShareStatus,
    roomName: currentRoomName,
    room,
    roomList,
  } = useAppSelector((state) => ({
    room: state.room.room,
    roomName: state.room.room.roomName,
    roomList: state.room.roomList,
    voiceStatus: state.user.voiceStatus,
    screenShareStatus: state.user.screenShareStatus,
  }));
  const [form] = Form.useForm();

  const isOnVoiceMember = () => {
    for (const key in room.member) {
      if (room.member[key].voiceStatus) {
        return true;
      }
    }
  };

  useEffect(() => {
    dispatch(getRoomListByDB());
  }, []);

  return (
    <Container>
      <div className={'logo-container'}>
        <img src="/linkevery/logo512.png" />
      </div>
      <div className={'room-list'}>
        {roomList.map((roomName) => (
          <RoomBadge
            onClick={() => {
              currentRoomName !== roomName && app.disconnect();
              navigate('/' + roomName);
            }}
            name={roomName}
            key={roomName}
          />
        ))}
      </div>

      <div>
        <ControllerContainer>
          {currentRoomName &&
            voiceStatus &&
            agentInfo.platform.type === 'desktop' && (
              <Tooltip defaultOpen={true} placement="right" title="화면공유">
                <Switch
                  style={{ marginBottom: 8 }}
                  disabled={!isOnVoiceMember()}
                  checked={screenShareStatus}
                  checkedChildren={<SvgScreenShareOn />}
                  unCheckedChildren={<SvgScreenShareOff />}
                  defaultChecked={false}
                  onChange={(value) => {
                    if (value) {
                      app.dispatch.sendScreenShareReadyMessage({});
                    } else {
                      app.closeScreenShare();
                      dispatch(userActions.changeScreenShareStatus(false));
                    }
                  }}
                />
              </Tooltip>
            )}
          {currentRoomName && (
            <Tooltip defaultOpen={true} placement="right" title="음성채팅">
              <Switch
                checked={voiceStatus}
                checkedChildren={<SvgMicOn />}
                unCheckedChildren={<SvgMicOff />}
                defaultChecked={false}
                onChange={async (value) => {
                  if (value) {
                    if (!(await mdUtils.isAvailableAudioInput())) {
                      notification.info({
                        message: `연결된 마이크가 없습니다. 마이크 확인 후 다시 시도해주세요.`,
                      });
                      return;
                    }

                    dispatch(userActions.changeVoiceStatus(true));
                    app.dispatch.sendVoiceReadyMessage({});
                  } else {
                    app.disconnectVoice();
                    if (screenShareStatus) {
                      app.closeScreenShare();
                      dispatch(userActions.changeScreenShareStatus(false));
                    } else {
                      videoManager.clearAllVideo();
                      app.rtcManager.clearVideoTrack();
                    }
                    dispatch(userActions.changeVoiceStatus(false));
                    dispatch(roomActions.setAllMemberVoiceOff());
                    dispatch(roomActions.setAllMemberScreenShareOff());
                    dispatch(userActions.changeLeftSideView(false));
                  }
                }}
              />
            </Tooltip>
          )}
        </ControllerContainer>
        {!currentRoomName && <Button onClick={() => setOpen(true)}>+</Button>}
      </div>
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
            const roomName = values.roomName + '+' + nanoid();
            dispatch(roomActions.setRoomName(roomName));
            dispatch(addRoomByDB({ roomName, member: {} }));

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

  .logo-container {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.color.primary800};
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
    }
  }

  .room-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: overlay;
    width: 100%;
    height: 100%;
  }
  .room-list::-webkit-scrollbar {
    display: none;
  }
`;

const ControllerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default LeftMenuContainer;
