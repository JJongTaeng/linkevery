import { notification } from 'antd';
import { HandlerMap, SCREEN_SHARE_MESSAGE_ID } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { videoManager } from '../media/VideoManager';

export const screenShareHandlers: HandlerMap<SCREEN_SHARE_MESSAGE_ID> = {
  [SCREEN_SHARE_MESSAGE_ID.READY]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    if (!store.getState().room.voiceStatus) {
      return;
    }

    dispatch.sendScreenShareReadyOkMessage({ to: protocol.from });
  },
  [SCREEN_SHARE_MESSAGE_ID.READY_OK]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    if (store.getState().room.screenShareStatus) return;
    store.dispatch(roomActions.changeScreenShareStatus(true));

    const voiceMember = [];
    const member = store.getState().room.member;
    for (const key in member) {
      if (member[key].voiceStatus) voiceMember.push(key);
    }

    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: { echoCancellation: true, noiseSuppression: true },
    });
    for (const key of voiceMember) {
      mediaStream?.getTracks().forEach((track) => {
        const peer = rtcManager.getPeer(key);
        peer.addTrack(track, mediaStream);
      });
      dispatch.sendScreenShareConnectedMessage({ to: key });
    }
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
    videoManager.clearVideo(from);
    videoManager.removeVideoNode(from);
    store.dispatch(roomActions.changeLeftSideView(false));
  },
};
