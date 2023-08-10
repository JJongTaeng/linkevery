import { message } from 'antd';
import { HandlerMap, SCREEN_SHARE_MESSAGE_ID } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { userActions } from '../../store/features/userSlice';
import { store } from '../../store/store';
import { App } from '../app/App';
import { videoManager } from '../media/VideoManager';
import { storage } from '../storage/StorageService';

export const screenShareHandlers: HandlerMap<SCREEN_SHARE_MESSAGE_ID> = {
  [SCREEN_SHARE_MESSAGE_ID.READY]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    if (!store.getState().user.voiceStatus) {
      return;
    }

    dispatch.sendScreenReadyOkMessage({ to: protocol.from });
  },
  [SCREEN_SHARE_MESSAGE_ID.READY_OK]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const { userKey } = storage.getAll();
    store.dispatch(userActions.changeScreenShareStatus(true));

    const voiceMember = [];
    const member = store.getState().room.current.member;
    for (const key in member) {
      if (member[key].voiceStatus) voiceMember.push(member[key].clientId);
    }
    try {
      let mediaStream = App.getInstance().screenMediaStream;
      if (!mediaStream) {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        App.getInstance().screenMediaStream = mediaStream;
      }

      for (const clientId of voiceMember) {
        mediaStream?.getTracks().forEach((track) => {
          const peer = rtcManager.getPeer(clientId);
          peer.addTrack(track, mediaStream!);
        });
        dispatch.sendScreenConnectedMessage({ to: clientId, userKey });
      }
    } catch (error: any) {
      if (error?.name === 'NotAllowedError') {
        message.info(`화면공유 권한 설정을 확인해주세요.`);
        store.dispatch(userActions.changeScreenShareStatus(false));
      }
    }
  },
  [SCREEN_SHARE_MESSAGE_ID.CONNECTED]: (protocol, { dispatch, rtcManager }) => {
    store.dispatch(
      roomActions.setMemberScreenShareStatus({
        userKey: protocol.data.userKey,
        screenShareStatus: true,
      }),
    );
  },
  [SCREEN_SHARE_MESSAGE_ID.DISCONNECT]: (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const { from } = protocol;

    store.dispatch(
      roomActions.setMemberScreenShareStatus({
        userKey: protocol.data.userKey,
        screenShareStatus: false,
      }),
    );
    videoManager.clearVideo(from);
  },
};
