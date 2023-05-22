import { message } from 'antd';
import { HandlerMap, SCREEN_SHARE_MESSAGE_ID } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { statusActions } from '../../store/features/statusSlice';
import { userActions } from '../../store/features/userSlice';
import { store } from '../../store/store';
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

    dispatch.sendScreenShareReadyOkMessage({ to: protocol.from });
  },
  [SCREEN_SHARE_MESSAGE_ID.READY_OK]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const { userKey } = storage.getAll();
    if (store.getState().user.screenShareStatus) return;
    store.dispatch(userActions.changeScreenShareStatus(true));

    const voiceMember = [];
    const member = store.getState().room.room.member;
    for (const key in member) {
      if (member[key].voiceStatus) voiceMember.push(member[key].clientId);
    }
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      for (const clientId of voiceMember) {
        mediaStream?.getTracks().forEach((track) => {
          const peer = rtcManager.getPeer(clientId);
          peer.addTrack(track, mediaStream);
        });
        dispatch.sendScreenShareConnectedMessage({ to: clientId, userKey });
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
    store.dispatch(statusActions.changeIsVisiblePlayView(false));
  },
};
