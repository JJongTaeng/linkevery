import { message, Tooltip } from 'antd';
import Bowser from 'bowser';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { mdUtils } from 'service/media/MediaDeviceUtils';
import { storage } from 'service/storage/StorageService';
import { clipboard } from 'service/utils/Clipboard';
import { roomActions } from 'store/features/roomSlice';
import { statusActions } from 'store/features/statusSlice';
import { userActions } from 'store/features/userSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { TOP_MENU_HEIGHT } from 'style/constants';
import Button from 'components/elements/Button';
import ToggleButton from 'components/elements/ToggleButton';
import SvgExit from 'components/icons/Exit';
import SvgInviteMember from 'components/icons/InviteMember';
import SvgMicOn from 'components/icons/MicOn';
import SvgScreenShareOn from 'components/icons/ScreenShareOn';
import { useApp } from 'hooks/useApp';
import { useRef } from 'react';
import { container } from 'tsyringe';
import { VideoManager } from 'service/media/VideoManager';
import SvgMenu from '../icons/Menu';

const agentInfo = Bowser.parse(window.navigator.userAgent);

const TopMenuContainer = () => {
  const navigate = useNavigate();
  const { app, voicePeerEmitter, screenSharePeerEmitter } = useApp();
  const videoManager = useRef(container.resolve(VideoManager))
    .current as VideoManager;
  const { leftMenuVisible, roomName, voiceStatus, screenShareStatus, room } =
    useAppSelector((state) => ({
      leftMenuVisible: state.status.leftMenuVisible,
      roomName: state.room.current.roomName,
      screenShareStatus: state.user.screenShareStatus,
      voiceStatus: state.user.voiceStatus,
      room: state.room.current,
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
        <div>
          {roomName && (
            <Tooltip
              defaultOpen={true}
              title="복사된 URL을 초대할 사람에게 보내주세요."
            >
              <StyledSvgInviteMember
                onClick={() => {
                  clipboard.updateClipboard(window.location.href);
                }}
              />
            </Tooltip>
          )}
        </div>
      </RoomName>

      {roomName && (
        <ControllerWrapper>
          {voiceStatus && agentInfo.platform.type === 'desktop' && (
            <ToggleButton
              onChange={(value) => {
                if (value) {
                  screenSharePeerEmitter.sendScreenReadyMessage({});
                } else {
                  app.closeScreenShare();
                  dispatch(userActions.changeScreenShareStatus(false));
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
              }
            }}
          >
            <SvgMicOn />
          </ToggleButton>
          <Button style={{ background: 'white' }}>
            <SvgExit
              className={'exit'}
              onClick={() => {
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
`;

const ControllerWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const StyledSvgInviteMember = styled(SvgInviteMember)`
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
`;

export default TopMenuContainer;
