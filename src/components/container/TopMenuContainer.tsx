import { message } from 'antd';
import Bowser from 'bowser';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { mdUtils } from 'service/media/MediaDeviceUtils';
import { storage } from 'service/storage/StorageService';
import { roomActions } from 'store/features/roomSlice';
import { statusActions } from 'store/features/statusSlice';
import { userActions } from 'store/features/userSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { TOP_MENU_HEIGHT } from 'style/constants';
import Button from 'components/elements/Button';
import ToggleButton from 'components/elements/ToggleButton';
import SvgExit from 'components/icons/Exit';
import SvgMicOn from 'components/icons/MicOn';
import SvgScreenShareOn from 'components/icons/ScreenShareOn';
import { useApp } from 'hooks/useApp';
import { useRef } from 'react';
import { container } from 'tsyringe';
import { VideoManager } from 'service/media/VideoManager';
import SvgMenu from '../icons/Menu';
import { EVENT_NAME } from '../../constants/gtm';

const agentInfo = Bowser.parse(window.navigator.userAgent);

const TopMenuContainer = () => {
  const navigate = useNavigate();
  const { app, voicePeerEmitter, screenSharePeerEmitter } = useApp();
  const videoManager = useRef(container.resolve(VideoManager))
    .current as VideoManager;
  const {
    leftMenuVisible,
    roomName,
    voiceStatus,
    screenShareStatus,
    room,
    username,
  } = useAppSelector((state) => ({
    leftMenuVisible: state.status.leftMenuVisible,
    roomName: state.room.current.roomName,
    screenShareStatus: state.user.screenShareStatus,
    voiceStatus: state.user.voiceStatus,
    room: state.room.current,
    username: state.user.username,
  }));
  const dispatch = useAppDispatch();

  const isOnVoiceMember = () => {
    for (const key in room.member) {
      if (room.member[key].voiceStatus) {
        return true;
      }
    }
  };

  return (
    <Container>
      <Button
        style={{ background: 'white' }}
        onClick={() =>
          dispatch(statusActions.changeLeftMenuVisible(!leftMenuVisible))
        }
      >
        <SvgMenu />
      </Button>
      <RoomName>
        <Text>{roomName ? roomName?.split('+')[0] : ''}</Text>
      </RoomName>

      {roomName && (
        <ControllerWrapper>
          {voiceStatus && agentInfo.platform.type === 'desktop' && (
            <ToggleButton
              onChange={(value) => {
                if (value) {
                  screenSharePeerEmitter.sendScreenReadyMessage({});
                  window.dataLayer.push({
                    event: EVENT_NAME.screenShareStart,
                    roomName,
                    username,
                  });
                } else {
                  app.closeScreenShare();
                  dispatch(userActions.changeScreenShareStatus(false));
                  window.dataLayer.push({
                    event: EVENT_NAME.screenShareEnd,
                    roomName,
                    username,
                  });
                }
              }}
              disabled={!isOnVoiceMember()}
              checked={screenShareStatus}
            >
              <SvgScreenShareOn style={{ width: 20, height: 20 }} />
            </ToggleButton>
          )}
          <ToggleButton
            style={{ background: 'white' }}
            checked={voiceStatus}
            onChange={async (value) => {
              if (value) {
                if (!(await mdUtils.isAvailableAudioInput())) {
                  message.info(
                    `연결된 마이크가 없습니다. 마이크 확인 후 다시 시도해주세요.`,
                  );
                  return;
                }
                storage.setItem('voiceStatus', true);
                dispatch(userActions.changeVoiceStatus(true));
                voicePeerEmitter.sendVoiceReadyMessage({});

                window.dataLayer.push({
                  event: EVENT_NAME.voiceStart,
                  roomName,
                  username,
                });
              } else {
                storage.setItem('voiceStatus', false);
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
                window.dataLayer.push({
                  event: EVENT_NAME.voiceEnd,
                  roomName,
                  username,
                });
              }
            }}
          >
            <SvgMicOn />
          </ToggleButton>
          <Button style={{ background: 'white' }}>
            <SvgExit
              className={'exit'}
              onClick={() => {
                window.dataLayer.push({
                  event: EVENT_NAME.exitRoom,
                  roomName,
                });
                navigate('/');
              }}
            />
          </Button>
        </ControllerWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: ${TOP_MENU_HEIGHT}px;
  background-color: ${({ theme }) => theme.color.primary100};
  color: ${({ theme }) => theme.color.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  .exit {
    cursor: pointer;
    transition: 0.2s;
  }
  .exit:hover {
    transform: scale(1.1);
  }
`;

const Text = styled.span`
  color: ${({ theme }) => theme.color.primary100};
  font-weight: bold;
  color: ${({ theme }) => theme.color.white};
`;

const RoomName = styled.div`
  display: flex;

  svg {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    cursor: pointer;
    circle {
      stroke: white;
    }
    path {
      stroke: white;
    }
  }
`;

const ControllerWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export default TopMenuContainer;
