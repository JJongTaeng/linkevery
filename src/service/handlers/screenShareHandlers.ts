import { notification } from 'antd';
import { HandlerMap, SCREEN_SHARE_MESSAGE_ID } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';

export const screenShareHandlers: HandlerMap<SCREEN_SHARE_MESSAGE_ID> = {
  [SCREEN_SHARE_MESSAGE_ID.READY]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    if (!store.getState().room.voiceStatus) {
      return;
    }

    dispatch.sendScreenShareReadyOkMessage({});
  },
  [SCREEN_SHARE_MESSAGE_ID.READY_OK]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: { echoCancellation: true, noiseSuppression: true },
    });
    mediaStream?.getTracks().forEach((track) => {
      const peer = rtcManager.getPeer(protocol.from);
      console.log(track, mediaStream);
      peer.addTrack(track, mediaStream);
    });
    dispatch.sendScreenShareConnectedMessage({});
  },
  [SCREEN_SHARE_MESSAGE_ID.CONNECTED]: (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;

    store.dispatch(
      roomActions.setMemberScreenShareStatus({
        clientId: from,
        screenShareStatus: true,
      }),
    );

    notification.info({
      message: `${
        store.getState().room.member[from].username
      }이 화면공유를 시작했습니다.`,
    });
  },
  [SCREEN_SHARE_MESSAGE_ID.DISCONNECT]: (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const { from } = protocol;

    store.dispatch(
      roomActions.setMemberScreenShareStatus({
        clientId: from,
        screenShareStatus: false,
      }),
    );
  },
};
