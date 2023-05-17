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
import MemberListContainer from '../room/MemberListContainer';
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
    leftMenuVisible,
  } = useAppSelector((state) => ({
    room: state.room.room,
    roomName: state.room.room.roomName,
    roomList: state.room.roomList,
    voiceStatus: state.user.voiceStatus,
    screenShareStatus: state.user.screenShareStatus,
    leftMenuVisible: state.ui.leftMenuVisible,
  }));
  const [form] = Form.useForm();
  console.log(leftMenuVisible);
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
    <Container $leftMenuVisible={leftMenuVisible}>
      <LeftLeftContainer>
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
            {currentRoomName ? (
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
            ) : (
              <Button onClick={() => setOpen(true)}>+</Button>
            )}
          </ControllerContainer>
        </div>
      </LeftLeftContainer>

      {currentRoomName && (
        <LeftRightContainer>
          <MemberListContainer />
        </LeftRightContainer>
      )}

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

const Container = styled.section<{ $leftMenuVisible: boolean }>`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${({ $leftMenuVisible }) => ($leftMenuVisible ? '' : '0px')};
  transform: ${({ $leftMenuVisible }) => ($leftMenuVisible ? '' : 'scaleX(0)')};
  transform-origin: left;
  transition: 0.2s;
  svg {
    margin-top: 4px;
  }
  g {
    fill: white;
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

const LeftLeftContainer = styled.div`
  height: 100%;
  width: 70px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.primary100};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.color.primary100} 40%,
    ${({ theme }) => theme.color.primary400} 100%
  );
  .room-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: overlay;
    width: 100%;
    height: 100%;
  }
`;

const LeftRightContainer = styled.div`
  height: 100%;
`;

export default LeftMenuContainer;
