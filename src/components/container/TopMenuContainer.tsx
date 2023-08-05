import { Tooltip, message } from 'antd';
import Bowser from 'bowser';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { App } from '../../service/app/App';
import { mdUtils } from '../../service/media/MediaDeviceUtils';
import { videoManager } from '../../service/media/VideoManager';
import { storage } from '../../service/storage/StorageService';
import { clipboard } from '../../service/utils/Clipboard';
import { roomActions } from '../../store/features/roomSlice';
import { statusActions } from '../../store/features/statusSlice';
import { userActions } from '../../store/features/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { TOP_MENU_HEIGHT } from '../../style/constants';
import Button from '../elements/Button';
import ToggleButton from '../elements/ToggleButton';
import SvgExit from '../icons/Exit';
import SvgInviteMember from '../icons/InviteMember';
import SvgLeftIndent from '../icons/LeftIndent';
import SvgMicOn from '../icons/MicOn';
import SvgRightIndent from '../icons/RightIndent';
import SvgScreenShareOn from '../icons/ScreenShareOn';

const agentInfo = Bowser.parse(window.navigator.userAgent);

const TopMenuContainer = () => {
  const navigate = useNavigate();
  const app = useRef(App.getInstance()).current;

  const { leftMenuVisible, roomName, voiceStatus, screenShareStatus, room } =
    useAppSelector((state) => ({
      leftMenuVisible: state.status.leftMenuVisible,
      roomName: state.room.room.roomName,
      screenShareStatus: state.user.screenShareStatus,
      voiceStatus: state.user.voiceStatus,
      room: state.room.room,
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
      <div
        className={'menu-button'}
        onClick={() =>
          dispatch(statusActions.changeLeftMenuVisible(!leftMenuVisible))
        }
      >
        {leftMenuVisible ? <SvgLeftIndent /> : <SvgRightIndent />}
      </div>
      <RoomName>
        <Text>{roomName ? roomName?.split('+')[0] : ''}</Text>
        <div>
          {roomName && (
            <Tooltip
              defaultOpen={true}
              title="복사된 URL을 초대할 사람에게 보내주세요."
            >
              <SvgInviteMember
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
                  app.dispatch.sendScreenReadyMessage({});
                } else {
                  app.closeScreenShare();
                  dispatch(userActions.changeScreenShareStatus(false));
                }
              }}
              disabled={!isOnVoiceMember()}
              checked={screenShareStatus}
            >
              <SvgScreenShareOn />
            </ToggleButton>
          )}
          <ToggleButton
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
                app.dispatch.sendVoiceReadyMessage({});
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
                dispatch(statusActions.changeIsVisiblePlayView(false));
              }
            }}
          >
            <SvgMicOn />
          </ToggleButton>
          <Button>
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
    width: 20px;
    height: 20px;
    transition: 0.2s;
  }
  .exit:hover {
    transform: scale(1.1);
  }
  .menu-button {
    position: relative;
    border-radius: 50%;
    border: 1px solid #fff;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
      width: 20px;
      height: 20px;
    }
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
    margin-left: 8px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const ControllerWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export default TopMenuContainer;
